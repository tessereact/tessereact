const WebSocket = require('ws')
const puppeteer = require('puppeteer')

/**
 * Connect to a browser.
 *
 * @returns {Promise<Browser>} promise with browser object
 */
function connectToBrowser () {
  return puppeteer.launch()
}

/**
 * Get a page from a browser.
 *
 * @param {Browser} browser
 * @returns {Promise<Page>} promise with page object
 */
function getPage (browser) {
  return browser.newPage()
}

/**
 * Disconnect from a browser.
 *
 * @param {Browser} browser
 * @returns {Promise} promise, resolved when browser is disconnected
 */
function disconnectFromBrowser (browser) {
  return browser.close()
}

/**
 * Wait for WebSocket message from a browser, run callback with message, parsed as JSON.
 *
 * @param {Number} websocketPort
 * @param {Function} callback
 */
function onMessageFromBrowser (webSocketPort, callback) {
  return new Promise(resolve => {
    const webSocketServer = new WebSocket.Server({ port: webSocketPort })
    webSocketServer.on('connection', (webSocket) => {
      webSocket.on('message', (message) => {
        callback(JSON.parse(message))
      })
    })
  })
}

module.exports = {
  connectToBrowser,
  getPage,
  disconnectFromBrowser,
  onMessageFromBrowser
}
