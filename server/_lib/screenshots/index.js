const path = require('path')
const fsp = require('fs-promise')
const crypto = require('crypto')
const exec = require('child_process').exec

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
 * @param {Page} page
 * @param {String} url
 * @param {Object} [options]
 * @param {Number} [options.width]
 * @param {Number} [options.height]
 * @returns {Promise<String>} promise with a screenshot path
 */
async function createScreenshot (screenshotsDir, page, url, {width = 1024, height = 768} = {}) {
  const filePath = path.join(
    screenshotsDir,
    `${crypto.createHash('md5').update(url).digest('hex')}.png`
  )

  await page.setViewport({ width, height })
  await page.goto(url)
  await page.screenshot({ path: filePath })
  return filePath
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
 * @param {String} screenshotDiffCommand
 * @param {String} screenshotDiffExtension
 * @returns {Promise<String>} promise with full path of the resulting diff
 */
function diffScreenshots (screenshotsDir, pathA, pathB, screenshotDiffCommand, screenshotDiffExtension) {
  return new Promise((resolve, reject) => {
    const pathDiff = path.join(
      screenshotsDir,
      `${crypto.createHash('md5').update(pathA + ':' + pathB).digest('hex')}.${screenshotDiffExtension}`
    )
    const cmd = screenshotDiffCommand
      .replace('$BEFORE', pathA)
      .replace('$AFTER', pathB)
      .replace('$RESULT', pathDiff)

    exec(cmd, () => {
      return resolve(pathDiff)
    })
  })
}

module.exports = {
  ensureScreenshotDir,
  createScreenshot,
  deleteScreenshot,
  diffScreenshots
}
