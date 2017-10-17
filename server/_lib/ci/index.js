const WebSocket = require('ws')
const puppeteer = require('puppeteer')
const { readBrowserData } = require('../snapshots')

/**
 * Start Chromium, open Tessereact in it, wait for a message from the web page.
 * Report the message and end the process.
 *
 * @param {Number} tessereactPort - port used for running Tessereact web app
 * @param {Number} wsPort - web socket port for communication with the web pacge
 * @param {String} snapshotsDir
 */
async function runCI (tessereactPort, wsPort, snapshotsDir) {
  const wss = new WebSocket.Server({port: wsPort})
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`http://localhost:${tessereactPort}`)

  wss.on('connection', (ws) => {
    console.log('Connected to WS')
    ws.on('message', async (message) => {
      const report = JSON.parse(message)

      console.log('Received a message from Tessereact runner')
      await browser.close()
      const lastAcceptedBrowserData = readBrowserData(snapshotsDir)

      if (report.status === 'OK') {
        console.log('All scenarios are passed')
        process.exit(0)
      } else {
        console.error('Failed scenarios:')

        const logs = report.scenarios
          .map(s => `- ${s.context}/${s.name}\n\n${s.diff}`)
          .concat(lastAcceptedBrowserData && `Last accepted browser: ${JSON.stringify(lastAcceptedBrowserData, null, '  ')}`)
          .concat(`Current browser: ${JSON.stringify(report.browserData, null, '  ')}`)
          .concat('\n')
          .filter(x => x)
          .join('\n\n')

        process.stdout.write(logs, () => process.exit(1))
      }
    })
  })
}

module.exports = {
  runCI
}
