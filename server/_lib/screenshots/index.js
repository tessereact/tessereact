const webdriverio = require('webdriverio')
const path = require('path')
const fsp = require('fs-promise')
const crypto = require('crypto')
const exec = require('child_process').exec

/**
 * Connect to a browser using Chrome Debugging Protocol.
 *
 * @param {Object} options - webdriver options object
 * @returns {Promise<Client>} promise with webdriverio object
 */
function connectToBrowser (options) {
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
 * Create screenshotsDir if it doesn't exist.
 *
 * @param {String} screenshotsDir
 * @returns {Promise}
 */
function ensureScreenshotDir (screenshotsDir) {
  return fsp.ensureDir(screenshotsDir)
}

/**
 * Create a screenshot of a web-page on a specific URL.
 *
 * @param {String} screenshotsDir
 * @param {Client} client - webdriverio object
 * @param {String} url
 * @param {Object} [options]
 * @param {Number} [options.width]
 * @param {Number} [options.height]
 * @returns {Promise<String>} promise with a screenshot path
 */
function createScreenshot (screenshotsDir, client, url, {width = 1024, height = 768} = {}) {
  const filePath = path.join(
    screenshotsDir,
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
 * @param {String} screenshotsDir
 * @param {String} pathA
 * @param {String} pathB
 * @returns {Promise<String>} promise with full path of the resulting diff
 */
function diffScreenshots (screenshotsDir, pathA, pathB) {
  return new Promise((resolve, reject) => {
    const pathDiff = path.join(
      screenshotsDir,
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

/**
 * Build full page snapshot from HTML and CSS snapshots.
 *
 * @param {String} html
 * @param {String} css
 * @returns {String} HTML and CSS snapshots combined
 */
function buildScreenshotPage (html, css) {
  if (!css || !html) {
    return null
  }

  return ['<style>']
    .concat(css)
    .concat('</style>')
    .concat('')
    .concat(html)
    .join('\n')
}

module.exports = {
  connectToBrowser,
  ensureScreenshotDir,
  createScreenshot,
  disconnectFromBrowser,
  deleteScreenshot,
  diffScreenshots,
  buildScreenshotPage
}
