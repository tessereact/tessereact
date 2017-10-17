const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const getPort = require('get-port')
const ejs = require('ejs')
const {
  connectToBrowser,
  getPage,
  disconnectFromBrowser
} = require('./_lib/browser')
const {
  readSnapshot,
  writeSnapshot,
  writeBrowserData
} = require('./_lib/snapshots')
const {
  ensureScreenshotDir,
  createScreenshot,
  deleteScreenshot,
  diffScreenshots
} = require('./_lib/screenshots')
const { runCI } = require('./_lib/ci')

const defaultPort = 5001
const defaultScreenshotDiffExtension = 'gif'

const defaultBeforeCommand = "$BEFORE -background '#FFE6E8' -pointsize 20 label:'Before' +swap -gravity Center -append"
const defaultAfterCommand = "$AFTER -background '#D2FFDB' -pointsize 20 label:'After' +swap -gravity Center -append"
const defaultScreenshotDiffCommand = `convert -delay 100 '(' ${defaultBeforeCommand} ')' '(' ${defaultAfterCommand} ')' -loop 0 $RESULT`

/**
 * Start the server.
 *
 * @param {String} cwd - directory of script
 * @param {Object} config
 * @param {Function} [callback] - called after server is started
 */
module.exports = function server (cwd, config, callback) {
  let expressServer

  const screenshotsDir = path.resolve(cwd, 'tmp')
  const snapshotsDir = path.resolve(cwd, config.snapshotsPath)

  const screenshotDiffCommand = (config.screenshotDiff && config.screenshotDiff.command) || defaultScreenshotDiffCommand
  const screenshotDiffExtension = (config.screenshotDiff && config.screenshotDiff.resultExtension) || defaultScreenshotDiffExtension

  const app = express()
  app.use(bodyParser.json({limit: '50mb'})) // for parsing application/json
  app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
  app.use(cors({
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  }))

  getPort()
    .then(wsPort => {
      const renderIndex = (req, res) => {
        const templatePath = config.templatePath
          ? path.resolve(cwd, config.templatePath)
          : path.resolve(__dirname, './index.ejs')
        const locals = {
          entryPath: config.entryURL,
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
        const exit = (code) => {
          expressServer.close()
          process.exit(code)
        }
        runCI(config.port, wsPort, snapshotsDir, exit).catch(rescue)
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
    const {name, context, snapshot, snapshotCSS, browserData} = req.body
    if (snapshotCSS) {
      await Promise.all([
        writeSnapshot(snapshotsDir, snapshot, name, context, 'html'),
        writeSnapshot(snapshotsDir, snapshotCSS, name, context, 'css'),
        writeBrowserData(snapshotsDir, browserData)
      ])
    } else {
      await Promise.all([
        writeSnapshot(snapshotsDir, snapshot, name, context, 'html'),
        writeBrowserData(snapshotsDir, browserData)
      ])
    }

    res.send({status: 'OK'})
  })

  app.options('/screenshot', cors())
  app.post('/screenshot', async (req, res) => {
    const {before, after, size} = req.body
    const beforeURL = `data:text/html;charset=utf-8,${encodeURIComponent(before)}`
    const afterURL = `data:text/html;charset=utf-8,${encodeURIComponent(after)}`

    await ensureScreenshotDir(screenshotsDir)
    const browser = await connectToBrowser()
    const page = await getPage(browser)
    const beforeScreenshotPath = await createScreenshot(screenshotsDir, page, beforeURL, size)
    const afterScreenshotPath = await createScreenshot(screenshotsDir, page, afterURL, size)
    await disconnectFromBrowser(browser)

    const diffPath = await diffScreenshots(screenshotsDir, beforeScreenshotPath, afterScreenshotPath, screenshotDiffCommand, screenshotDiffExtension)

    res.sendFile(diffPath, () => {
      deleteScreenshot(beforeScreenshotPath)
      deleteScreenshot(afterScreenshotPath)
      deleteScreenshot(diffPath)
    })
  })

  expressServer = app.listen(config.port || defaultPort, callback)
}

function rescue (err) {
  console.error(err)
  process.exit(1)
}
