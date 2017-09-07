const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const cors = require('cors')
const {startChromeDriver} = require('../../../lib/lib/chromeDriver')
const getPort = require('get-port')
const ejs = require('ejs')
const {
  readSnapshot,
  writeSnapshot,
  buildPage
} = require('../snapshots')
const {
  connectToBrowser,
  createScreenshot,
  disconnectFromBrowser,
  deleteScreenshot,
  diffScreenshots
} = require('../screenshots')
const collectStylesFromSnapshot = require('../collectStylesFromSnapshot')
const formatHTML = require('../formatHTML')
const {
  diffSnapshots,
  diffToHTML
} = require('../diff')
const hash = require('object-hash')

/**
 * Start the server.
 *
 * @param {String} cwd - directory of script
 * @param {Object} config
 * @param {Function} [callback] - called after server is started
 */
module.exports = function server (cwd, config, callback) {
  const screenshotsDir = path.resolve(cwd, 'tmp')
  const snapshotsDir = path.resolve(cwd, config.snapshots_path)

  const shouldCacheCSS = config.cache_css_policy === 'cache'

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
        const templatePath = config.template_path
          ? path.resolve(cwd, config.template_path)
          : path.resolve(__dirname, './index.ejs')
        const locals = {
          entryPath: process.env.CI ? config.built_entry_path : config.entry_url,
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
        app.use(express.static(path.resolve(cwd, config.build_path)))

        const wss = new WebSocket.Server({port: wsPort})

        startChromeDriver()
          .then(({kill, open}) => {
            wss.on('connection', (ws) => {
              console.log('Connected to WS')
              ws.on('message', (message) => {
                console.log('Got message from Testshot runner')
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

        let diffPatch
        let css
        let screenshotData

        if (options.css) {
          css = collectStylesFromSnapshot(styles, html, shouldCacheCSS, styleHash)

          const [oldHTML, oldCSS] = await Promise.all([
            readSnapshot(snapshotsDir, name, context, 'html'),
            readSnapshot(snapshotsDir, name, context, 'css')
          ])

          diffPatch = [
            diffSnapshots('HTML', oldHTML, html),
            diffSnapshots('CSS', oldCSS, css)
          ].filter(x => x).join('\n')

          if (options.screenshot && diffPatch) {
            screenshotData = {
              before: buildPage(oldHTML, oldCSS),
              after: buildPage(html, css)
            }
          }
        } else {
          const oldHTML = await readSnapshot(snapshotsDir, name, context, 'html')
          diffPatch = diffSnapshots('HTML', oldHTML, html)
        }

        const diff = diffToHTML(diffPatch)

        return resolve({
          name,
          context,
          diff,
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
    const {before, after} = req.body
    const beforeURL = `data:text/html;charset=utf-8,${encodeURIComponent(before)}`
    const afterURL = `data:text/html;charset=utf-8,${encodeURIComponent(after)}`

    const options = {
      width: config.screenshot_width || 320,
      height: config.screenshot_height || 568
    }

    const chrome = connectToBrowser()
    const beforeScreenshotPath = await createScreenshot(screenshotsDir, chrome, beforeURL, options)
    const afterScreenshotPath = await createScreenshot(screenshotsDir, chrome, afterURL, options)
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
