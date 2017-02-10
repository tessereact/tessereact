#!/usr/bin/env node

'use strict'
const path = require('path')
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const globby = require('globby')
const fsp = require('fs-promise')

const configFile = path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json')
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
const defaultSnapshotsDir = path.resolve(process.cwd(), config.snapshots_path)
const CONTEXT_DELIMITER = ' - '
const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
app.use(cors({
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
}))

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
        console.log(`${name} ... ${snapshot}`)
        acc[name] = snapshot
        return acc
      }, {})
    })
    .then(snapshots => {
      // TODO: Improve logging
      console.log('Stored snapshots', Object.keys(snapshots))
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
      console.log(`${name} written`)
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
