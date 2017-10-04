const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const cors = require('cors')
const {startChromeDriver} = require('./_lib/chromeDriver')
const getPort = require('get-port')
const ejs = require('ejs')
const {
  readSnapshot,
  writeSnapshot
} = require('./_lib/snapshots')
const {
  connectToBrowser,
  ensureScreenshotDir,
  createScreenshot,
  disconnectFromBrowser,
  deleteScreenshot,
  diffScreenshots
} = require('./_lib/screenshots')
const chromedriver = require('chromedriver')

const defaultPort = 5001
const defaultChromedriverPort = 5003
const defaultScreenshotDiffCommand = 'convert -delay 50 $BEFORE $AFTER -loop 0 $RESULT'

/**
 * Start the server.
 *
 * @param {String} cwd - directory of script
 * @param {Object} config
 * @param {Function} [callback] - called after server is started
 */
module.exports = function server (cwd, config, callback) {
  const screenshotsDir = path.resolve(cwd, 'tmp')
  const snapshotsDir = path.resolve(cwd, config.snapshotsPath)

  const screenshotDiffCommand = config.screenshotDiffCommand || defaultScreenshotDiffCommand

  const app = express()
  app.use(bodyParser.json({limit: '50mb'})) // for parsing application/json
  app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
  app.use(cors({
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  }))

  const chromedriverPort = config.chromedriverPort || defaultChromedriverPort
  chromedriver.start([
    '--url-base=wd/hub',
    `--port=${chromedriverPort}`
  ])
  const webdriverOptions = {
    port: chromedriverPort,
    desiredCapabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          'headless',
          'disable-gpu',
          'hide-scrollbars'
        ]
      }
    }
  }

  getPort()
    .then(wsPort => {
      const wsURL = `ws://localhost:${wsPort}`

      const renderIndex = (req, res) => {
        const templatePath = config.templatePath
          ? path.resolve(cwd, config.templatePath)
          : path.resolve(__dirname, './index.ejs')
        const locals = {
          entryPath: process.env.CI ? config.builtEntryPath : config.entryURL,
          wsURL,
          tessereactServerPort: config.port,
          config: JSON.stringify(config)
        }

        ejs.renderFile(templatePath, locals, {}, (err, templateHTML) => {
          if (err) {
            throw err
          }
          res.send(templateHTML)
        })
      }

      app.get('/contexts/:context/scenarios/:scenario/view', renderIndex)
      app.get('/contexts/:context/scenarios/:scenario', renderIndex)
      app.get('/contexts/:context', renderIndex)
      app.get('/demo', renderIndex)
      app.get('/', renderIndex)

      if (process.env.CI) {
        app.use(express.static(path.resolve(cwd, config.buildPath)))

        const wss = new WebSocket.Server({port: wsPort})

        startChromeDriver()
          .then(({kill, open}) => {
            wss.on('connection', (ws) => {
              console.log('Connected to WS')
              ws.on('message', (message) => {
                console.log('Got message from Tessereact runner')
                kill()

                if (message === 'OK') {
                  process.exit(0)
                } else {
                  const failingScenarios = JSON.parse(message)
                  console.error('Failed scenarios:')
                  failingScenarios.forEach(s => console.log(`- ${s.context} ${s.name}`))
                  process.exit(1)
                }
              })
            })

            return open(`http://localhost:${config.port}`)
          })
          .catch(rescue)
      }
    })

  app.options('/config', cors())
  app.get('/config', async (req, res) => {
    res.send(config)
  })

  app.options('/read-snapshots', cors())
  app.post('/read-snapshots', async (req, res) => {
    const {scenarios} = req.body

    const payload = await Promise.all(
      scenarios.map(({ name, context, options = {} }) => new Promise(async resolve => {
        const [snapshot, snapshotCSS] = await Promise.all([
          readSnapshot(snapshotsDir, name, context, 'html'),
          readSnapshot(snapshotsDir, name, context, 'css')
        ])

        return resolve({
          name,
          context,
          snapshot,
          snapshotCSS
        })
      }))
    )
    res.send({scenarios: payload})
  })

  app.options('/write-snapshot', cors())
  app.post('/write-snapshot', async (req, res) => {
    const {name, context, snapshot, snapshotCSS} = req.body
    if (snapshotCSS) {
      await Promise.all([
        writeSnapshot(snapshotsDir, snapshot, name, context, 'html'),
        writeSnapshot(snapshotsDir, snapshotCSS, name, context, 'css')
      ])
    } else {
      await writeSnapshot(snapshotsDir, snapshot, name, context, 'html')
    }

    res.send({status: 'OK'})
  })

  app.options('/screenshot', cors())
  app.post('/screenshot', async (req, res) => {
    const {before, after, size} = req.body
    const beforeURL = `data:text/html;charset=utf-8,${encodeURIComponent(before)}`
    const afterURL = `data:text/html;charset=utf-8,${encodeURIComponent(after)}`

    await ensureScreenshotDir(screenshotsDir)
    const chrome = connectToBrowser(webdriverOptions)
    const beforeScreenshotPath = await createScreenshot(screenshotsDir, chrome, beforeURL, size)
    const afterScreenshotPath = await createScreenshot(screenshotsDir, chrome, afterURL, size)
    disconnectFromBrowser(chrome)

    const diffPath = await diffScreenshots(screenshotsDir, beforeScreenshotPath, afterScreenshotPath, screenshotDiffCommand)

    res.sendFile(diffPath, () => {
      deleteScreenshot(beforeScreenshotPath)
      deleteScreenshot(afterScreenshotPath)
      deleteScreenshot(diffPath)
    })
  })

  app.listen(config.port || defaultPort, callback)
}

function rescue (err) {
  console.error(err)
  process.exit(1)
}
