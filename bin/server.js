#!/usr/bin/env node

'use strict'
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const bodyParser = require('body-parser')
const cors = require('cors')
const globby = require('globby')
const fsp = require('fs-promise')
const fetch = require('node-fetch')
const {startChromeDriver} = require('../lib/lib/chromeDriver')
const getPort = require('get-port')
const ejs = require('ejs')
const { Diff2Html } = require('diff2html')
const difflib = require('difflib')
const { JSDOM } = require('jsdom')

process.on(
  'unhandledRejection', e => console.log(e)
)

const config = require(path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json'))
const defaultSnapshotsDir = path.resolve(process.cwd(), config.snapshots_path)
const CONTEXT_DELIMITER = ' - '
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
        ? path.resolve(process.cwd(), config.template_path)
        : path.resolve(__dirname, '../index.ejs')
      const locals = {
        entryPath: process.env.CI ? config.built_entry_path : config.entry_url,
        wsURL,
        diffCSS: config.diff_css
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
app.post('/snapshots-list', async (req, res) => {
  const {scenarios, styles} = req.body

  const payload = await Promise.all(
    scenarios.map(async ({ name, context, snapshot: html }) => {
      let diffPatch
      let css

      if (styles) {
        css = collectStylesFromSnapshot(styles, html)

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

      const diff = diffPatch && Diff2Html.getPrettyHtml(diffPatch, {outputFormat: 'side-by-side'})

      return {
        name,
        context,
        diff,
        snapshot: html,
        snapshotCSS: css
      }
    })
  )
  res.send({scenarios: payload})
})

app.options('/snapshots', cors())
app.post('/snapshots', async (req, res) => {
  const {name, context, snapshot, snapshotCSS} = req.body
  if (snapshotCSS) {
    await Promise.all([
      writeSnapshot(name, context, snapshot, 'html'),
      writeSnapshot(name, context, snapshotCSS, 'css')
    ])
  } else {
    await writeSnapshot(name, context, snapshot, 'html')
  }

  res.send('OK')
})

app.listen(config.port, function () {
  console.log('Snapshot server is running on ' + config.port)
  console.log('Config: ', config)
})

function composeScenarioFileName (name, context, extension) {
  const fileName = context ? [context, name].join(CONTEXT_DELIMITER) : name
  return fileName + (extension ? '.' + extension : '')
}

function readSnapshot (name, context, extension = 'html') {
  return fsp
    .readFile(getSnapshotPath(name, context, extension))
    .catch(() => null)
    .then((file) =>
      file == null ? null : file.toString()
    )
}

function writeSnapshot (scenario, context, snapshot, extension = 'html') {
  const dir = path.join(defaultSnapshotsDir, context || '')
  return fsp
    .ensureDir(dir)
    .then(() =>
      fsp.writeFile(path.resolve(dir, composeScenarioFileName(scenario, context, extension)), snapshot)
    )
}

function getSnapshotPath (scenarioName, contextName, extension) {
  const dir = path.join(defaultSnapshotsDir, contextName || '')
  return `${dir}/${composeScenarioFileName(scenarioName, contextName, extension)}`
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

function getMatchingStylesFromNodeArray (styles, nodes) {
  return styles.filter(rule => {
    // All at-rules (e.g. @font-face) are passed
    if (!rule.selectorText) {
      return true
    }

    // Strip all pseudoclasses and pseudoelements from the selector
    const selectorText = rule.selectorText.replace(/::?[a-z\-]+(\([^)]*\))?/g, '')
    return nodes.some(node => node.matches(selectorText))
  })
}

function collectStylesFromSnapshot (styles, snapshot) {
  const dom = new JSDOM(`<html><body><div>${snapshot}</div></body></html>`)
  return collectStylesFromNode(styles, dom.window.document.documentElement)
}

function collectStylesFromNode (styles, node) {
  if (!node) {
    return ''
  }

  const nodes = treeIntoArray(node)

  return getMatchingStylesFromNodeArray(styles, nodes)
    .map(style => {
      const [_, selectorText, cssText] = style.cssText.match(/([^{]*){([^}]*)}/)

      return [`${selectorText.trim()} {`]
        .concat(cssText
          .split(';')
          .map(prop => prop.trim())
          .filter(prop => prop)
          .map(prop => `  ${prop};`)
        )
        .concat('}\n')
        .join('\n')
    })
    .join('\n')
}

function treeIntoArray (node) {
  return [node]
    .concat(Array.prototype.slice.call(node.children).reduce(
      (array, child) => array.concat(treeIntoArray(child)),
      []
    ))
}

function diffSnapshots (name, snapshotA, snapshotB) {
  return difflib.unifiedDiff(
    snapshotA == null ? null : snapshotA.split('\n'),
    snapshotB == null ? null : snapshotB.split('\n'),
    {
      fromfile: name,
      tofile: name,
      lineterm: ''
    }
  ).join('\n')
}
