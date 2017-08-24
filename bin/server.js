#!/usr/bin/env node

'use strict'
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const cors = require('cors')
const {startChromeDriver} = require('../lib/lib/chromeDriver')
const getPort = require('get-port')
const ejs = require('ejs')
const {
  readSnapshot,
  writeSnapshot,
  buildFailed,
  writeFailed,
  deleteFailed
} = require('./_lib/snapshots')
const collectStylesFromSnapshot = require('./_lib/collectStylesFromSnapshot')
const formatHTML = require('./_lib/formatHTML')
const {
  diffSnapshots,
  diffToHTML
} = require('./_lib/diff')

const hash = require('object-hash')

process.on(
  'unhandledRejection', e => console.log(e)
)

const config = require(path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json'))
const app = express()

const shouldCacheCSS = config.cache_css_policy === 'cache'

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
        ? path.resolve(process.cwd(), config.template_path)
        : path.resolve(__dirname, '../index.ejs')
      const locals = {
        entryPath: process.env.CI ? config.built_entry_path : config.entry_url,
        wsURL
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
      app.use(express.static(path.resolve(process.cwd(), config.build_path)))

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
    scenarios.map(({ name, context, snapshot, diffCSS }) => new Promise(async resolve => {
      const html = formatHTML(snapshot)

      let diffPatch
      let css

      if (diffCSS) {
        css = collectStylesFromSnapshot(styles, html, shouldCacheCSS, styleHash)

        const [oldHTML, oldCSS] = await Promise.all([
          readSnapshot(name, context, 'html'),
          readSnapshot(name, context, 'css')
        ])

        diffPatch = [
          diffSnapshots('HTML', oldHTML, html),
          diffSnapshots('CSS', oldCSS, css)
        ].filter(x => x).join('\n')
      } else {
        const oldHTML = await readSnapshot(name, context, 'html')
        diffPatch = diffSnapshots('HTML', oldHTML, html)
      }

      if (diffPatch) {
        await writeFailed(buildFailed(html, css), name, context, 'html')
      }

      const diff = diffToHTML(diffPatch)

      return resolve({
        name,
        context,
        diff,
        snapshot: html,
        snapshotCSS: css
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
      writeSnapshot(snapshot, name, context, 'html'),
      writeSnapshot(snapshotCSS, name, context, 'css'),
      deleteFailed(name, context, 'html')
    ])
  } else {
    await Promise.all([
      writeSnapshot(snapshot, name, context, 'html'),
      deleteFailed(name, context, 'html')
    ])
  }

  res.send('OK')
})

app.listen(config.port, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})

function rescue (err) {
  console.error(err)
  process.exit(1)
}
