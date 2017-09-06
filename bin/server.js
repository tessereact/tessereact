#!/usr/bin/env node

'use strict'
const path = require('path')
const config = require(path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json'))
const server = require('./_lib/server')

process.on(
  'unhandledRejection', e => console.log(e)
)

server(process.cwd(), config, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})
