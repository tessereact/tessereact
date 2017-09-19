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
  diffScreenshots,
  buildScreenshotPage
} = require('./_lib/screenshots')
const collectStylesFromSnapshot = require('./_lib/collectStylesFromSnapshot')
const formatHTML = require('./_lib/formatHTML')
const {
  diffSnapshots,
  diffToHTML
} = require('./_lib/diff')
const hash = require('object-hash')

const defaultScreenshotSizes = [
  {"width": 320, "height": 568, "alias": "iPhone SE"},
  {"width": 1024, "height": 768}
]

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

  const shouldCacheCSS = config.cacheCSS

  const screenshotSizes = config.screenshotSizes || defaultScreenshotSizes

  const app = express()
  app.use(bodyParser.json({limit: '50mb'})) // for parsing application/json
  app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
  app.use(cors({
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  }))

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
          tessereactServerPort: config.port
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

  // TODO: Why we are doing `post` instead of `get` here?
  // Seems we need just one route (/snapshots) with `get/post` support.
  app.options('/snapshots-list', cors())
  app.post('/snapshots-list', async (req, res) => {
    const {scenarios, styles} = req.body
    const styleHash = shouldCacheCSS ? hash(styles) : null

    const payload = await Promise.all(
      scenarios.map(({ name, context, snapshot, options = {} }) => new Promise(async resolve => {
        const html = formatHTML(snapshot)
        const oldHTML = await readSnapshot(snapshotsDir, name, context, 'html')
        const diff = diffToHTML(diffSnapshots('HTML', oldHTML, html))

        let css
        let diffCSS
        let screenshotData
        if (options.css) {
          css = collectStylesFromSnapshot(styles, html, shouldCacheCSS, styleHash)
          const oldCSS = await readSnapshot(snapshotsDir, name, context, 'css')
          diffCSS = diffToHTML(diffSnapshots('CSS', oldCSS, css))

          if (options.screenshot && (diff || diffCSS)) {
            screenshotData = {
              before: buildScreenshotPage(oldHTML, oldCSS),
              after: buildScreenshotPage(html, css),
              screenshotSizes
            }
          }
        }

        return resolve({
          name,
          context,
          diff,
          diffCSS,
          snapshot: html,
          snapshotCSS: css,
          screenshotData
        })
      }))
    )
    res.send({scenarios: payload})
  })

  app.options('/snapshots', cors())
  app.post('/snapshots', async (req, res) => {
    const {name, context, snapshot, snapshotCSS} = req.body
    if (snapshotCSS) {
      await Promise.all([
        writeSnapshot(snapshotsDir, snapshot, name, context, 'html'),
        writeSnapshot(snapshotsDir,snapshotCSS, name, context, 'css')
      ])
    } else {
      await writeSnapshot(snapshotsDir, snapshot, name, context, 'html')
    }

    res.send('OK')
  })

  app.options('/screenshots', cors())
  app.post('/screenshots', async (req, res) => {
    const {before, after, size} = req.body
    const beforeURL = `data:text/html;charset=utf-8,${encodeURIComponent(before)}`
    const afterURL = `data:text/html;charset=utf-8,${encodeURIComponent(after)}`

    await ensureScreenshotDir(screenshotsDir)
    const chrome = connectToBrowser()
    const beforeScreenshotPath = await createScreenshot(screenshotsDir, chrome, beforeURL, size)
    const afterScreenshotPath = await createScreenshot(screenshotsDir, chrome, afterURL, size)
    disconnectFromBrowser(chrome)

    const diffPath = await diffScreenshots(screenshotsDir, beforeScreenshotPath, afterScreenshotPath)

    res.sendFile(diffPath, () => {
      deleteScreenshot(beforeScreenshotPath)
      deleteScreenshot(afterScreenshotPath)
      deleteScreenshot(diffPath)
    })
  })

  app.listen(config.port, callback)
}

function rescue (err) {
  console.error(err)
  process.exit(1)
}
