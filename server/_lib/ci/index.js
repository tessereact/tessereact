const {
  connectToBrowser,
  getPage,
  disconnectFromBrowser,
  onMessageFromBrowser
} = require('../browser')

/**
 * Start Chromium, open Tessereact in it, wait for a message from the web page.
 * Report the message and end the process.
 *
 * @param {Number} tessereactPort - port used for running Tessereact web app
 * @param {Number} wsPort - web socket port for communication with the web pacge
 * @param {String} snapshotsDir
 * @param {Function<Number>} exit - callback called with exit code
 */
async function runCI (tessereactPort, wsPort, snapshotsDir, exit) {
  onMessageFromBrowser(wsPort, async (report) => {
    console.log('Received a message from Tessereact runner')
    await disconnectFromBrowser(browser)

    if (report.status === 'OK') {
      console.log('All scenarios are passed')
      exit(0)
    } else {
      console.error('Failed scenarios:')

      const logs = report.scenarios
        .map(s => `- ${s.context}/${s.name}\n\n${s.diff}\n`)
        .join('\n')

      process.stdout.write(logs, () => exit(1))
    }
  })

  const browser = await connectToBrowser()
  const page = await getPage(browser)
  await page.goto(`http://localhost:${tessereactPort}/?wsPort=${wsPort}`)
}

module.exports = {
  runCI
}
