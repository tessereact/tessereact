#!/usr/bin/env node

'use strict'
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const globby = require('globby')
const fsp = require('fs-promise')
const chromeDriverPath = require('chromedriver').path
const {execFile} = require('child_process')
const fetch = require('node-fetch')
const {startChromeDriver} = require('../src/lib/chromeDriver')
const getPort = require('get-port')
const ejs = require('ejs')

const config = require(path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json'))
const defaultSnapshotsDir = path.resolve(process.cwd(), config.snapshots_path)
const CONTEXT_DELIMITER = ' - '
const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
app.use(cors({
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
}))

getPort()
  .then(wsPort => {
    const wsURL = `ws://localhost:${wsPort}`

    app.get('/', (req, res) => {
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
    })

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
                failingScenarios.forEach(s => console.log(`- ${composeScenarioFileName(s.name, s.context)}`))
                process.exit(1)
              }
            })
          })

          return open(`http://localhost:${config.port}`)
        })
        .catch(rescue)
    }
  })

function composeScenarioFileName (name, context) {
  return context
    ? [context, name].join(CONTEXT_DELIMITER)
    : name
}

// TODO: Why we are doing `post` instead of `get` here?
// Seems we need just one route (/snapshots) with `get/post` support.
app.options('/snapshots-list', cors())
app.post('/snapshots-list', (req, res) => {
  readSnapshots()
    .then(snapshots => {
      return snapshots.reduce((acc, {name, snapshot}) => {
        acc[name] = snapshot
        return acc
      }, {})
    })
    .then(snapshots => {
      const data = req.body.data
      const responseJSON = data.map(s => {
        s.previousSnapshot = snapshots ? snapshots[composeScenarioFileName(s.name, s.context)] : null
        return s
      })
      res.send(responseJSON)
    })
    .catch(rescue)
})

app.options('/snapshots', cors())
app.post('/snapshots', (req, res) => {
  const {name, context, snapshot} = req.body
  const fileName = composeScenarioFileName(name, context)
  const dir = path.join(defaultSnapshotsDir, context || '')
  writeSnapshot(fileName, snapshot, dir)
    .then(() => {
      // TODO: Improve logging
      console.log(`${fileName} written`)
      res.send('OK')
    })
    .catch(rescue)
})

app.listen(config.port, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})

function writeSnapshot (name, snapshot, dir = defaultSnapshotsDir) {
  return fsp.ensureDir(dir)
    .then(() => fsp.writeFile(path.resolve(dir, `${name}.html`), snapshot))
}

function readSnapshots (dir) {
  return globby([path.resolve(dir || defaultSnapshotsDir, '**/*.html')])
    .then(snapshotPaths => {
      return Promise.all(snapshotPaths.map(snapshotPath => {
        const {name} = path.parse(snapshotPath)
        return fsp.readFile(snapshotPath).then(snapshot => ({name, snapshot: snapshot.toString()}))
      }))
    })
}

function rescue (err) {
  console.error(err)
  process.exit(1)
}

function postJSON (url, body) {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
