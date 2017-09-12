#!/usr/bin/env node

'use strict'
const path = require('path')
const config = require(path.join(process.cwd(), process.env.TESSEREACT_CONFIG || 'tessereact.config.json'))
const server = require('../server')

process.on(
  'unhandledRejection', e => console.log(e)
)

server(process.cwd(), config, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})
