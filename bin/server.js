'use strict';

const CONFIG_NAME = 'testshot.json';
const express = require('express');
const fs = require('fs');
const Store = require("jfs");
const bodyParser = require('body-parser');
const app = express();
const config = JSON.parse(fs.readFileSync(process.cwd()+'/'+CONFIG_NAME, 'utf8'));
const cors = require('cors');
const staticPath = __dirname + '/build';
const appStaticPath = process.cwd() + '/build';
const db = new Store(config.db);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors({
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}))

app.options('/snapshots-list', cors())
app.post('/snapshots-list', function (req, res) {
  db.get('snapshots', function(err, obj){
    console.log('Stored snapshots', Object.keys(obj))
    const data = req.body.data
    var snapshots = data.map(s => {
      s.previousSnapshot = obj ? obj[s.name] : null
      return s
    })
    res.send(snapshots)
  })
})

app.options('/snapshots', cors())
app.post('/snapshots', function(req, res) {
  console.log('POST')
  db.get('snapshots', function(err, obj){
    let data = Object.assign({}, obj)
    data[req.body.name] = req.body.snapshot
    db.save('snapshots', data, function() {
      res.send('OK')
    })
  })
})

// app.use(express.static(staticPath));
app.use('/app', express.static(appStaticPath));

app.listen(config.port, function () {
  console.log('Snapshot server is running on ' + config.port)
})

