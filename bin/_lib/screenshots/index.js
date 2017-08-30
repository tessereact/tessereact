const webdriverio = require('webdriverio')
const chromedriver = require('chromedriver')
const path = require('path')
const fsp = require('fs-promise')
const crypto = require('crypto')
const exec = require('child_process').exec

const port = 1337
const defaultScreenshotsDir = path.resolve(process.cwd(), 'tmp')

const args = [
  '--url-base=wd/hub',
  `--port=${port}`
]
chromedriver.start(args)

const options = {
  port,
  desiredCapabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        'headless',
        'disable-gpu',
        'hide-scrollbars'
      ]
    }
  }
}

/**
 * Connect to a browser using Chrome Debugging Protocol.
 *
 * @returns {Promise<Client>} promise with webdriverio object
 */
function connectToBrowser () {
  return webdriverio.remote(options).init()
}

/**
 * Disconnect from a browser using Chrome Debugging Protocol.
 *
 * @param {Client} client - webdriverio object
 * @returns {Promise} promise, resolved when browser is disconnected
 */
function disconnectFromBrowser (client) {
  return client.end()
}

/**
 * Create a screenshot of a web-page on a specific URL.
 *
 * @param {Client} client - webdriverio object
 * @param {String} url
 * @param {Object} [options]
 * @param {Number} [options.width]
 * @param {Number} [options.height]
 * @returns {Promise<String>} promise with a screenshot path
 */
function createScreenshot (client, url, {width = 1024, height = 768} = {}) {
  const filePath = path.join(
    defaultScreenshotsDir,
    `${crypto.createHash('md5').update(url).digest('hex')}.png`
  )

  return new Promise((resolve, reject) => {
    client
      .url(url)
      .setViewportSize({width, height})
      .saveScreenshot(filePath)
      .then(() => {
        resolve(filePath)
      })
  })
}

/**
 * Remove a file from the file system.
 * If the file doesn't exist, do nothing.
 *
 * @param {String} filePath - full path of the file
 * @returns {Promise}
 */
function deleteScreenshot (filePath) {
  return fsp
    .unlink(filePath)
    .catch(() => null)
}

/**
 * Create a screenshot diff.
 *
 * @param {String} pathA
 * @param {String} pathB
 * @returns {Promise<String>} promise with full path of the resulting diff
 */
function diffScreenshots (pathA, pathB) {
  return new Promise((resolve, reject) => {
    const pathDiff = path.join(
      defaultScreenshotsDir,
      `${crypto.createHash('md5').update(pathA + ':' + pathB).digest('hex')}.gif`
    )
    const cmd = `convert -delay 50 ${pathA} ${pathB} -loop 0 ${pathDiff}`

    exec(cmd, function (error) {
      if (error) {
        return reject(error)
      }

      return resolve(pathDiff)
    })
  })

}

module.exports = {
  connectToBrowser,
  createScreenshot,
  disconnectFromBrowser,
  deleteScreenshot,
  diffScreenshots
}
