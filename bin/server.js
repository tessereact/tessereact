'use strict'
const path = require('path')
const express = require('express')
const fs = require('fs')
const Store = require('jfs')
const bodyParser = require('body-parser')
const cors = require('cors')

const configFile = path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json')
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))

const app = express()
const db = new Store(config.snapshots_path)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies
app.use(cors({
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
}))

// TODO: Why we are doing `post` instead of `get` here?
// Seems we need just one route (/snapshots) with `get/post` support.
app.options('/snapshots-list', cors())
app.post('/snapshots-list', (req, res) => {
  db.get('snapshots', (err, obj) => {
    if (err) console.log(err)
    // TODO: Improve logging
    console.log('Stored snapshots', Object.keys(obj))
    const data = req.body.data
    const snapshots = data.map(s => {
      s.previousSnapshot = obj ? obj[s.name] : null
      return s
    })
    res.send(snapshots)
  })
})

app.options('/snapshots', cors())
app.post('/snapshots', (req, res) => {
  db.get('snapshots', (err, obj) => {
    if (err) console.log(err)
    let data = Object.assign({}, obj)
    data[req.body.name] = req.body.snapshot
    db.save('snapshots', data, () => {
      res.send('OK')
    })
  })
})

app.listen(config.port, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})
