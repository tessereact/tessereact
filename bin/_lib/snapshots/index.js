const fs = require('fs')
const fsp = require('fs-promise')
const path = require('path')

const config = require(path.join(process.cwd(), process.env.TESTSHOT_CONFIG || 'testshot.config.json'))
const defaultSnapshotsDir = path.resolve(process.cwd(), config.snapshots_path)
const CONTEXT_DELIMITER = ' - '

/**
 * Read snapshot from the file system.
 *
 * @param {String} name - snapshot name
 * @param {String} context - context name
 * @param {String} [extension='html'] - file extension
 * @returns {Promise<String>} promise with snapshot
 */
function readSnapshot (name, context, extension = 'html') {
  const snapshotPath = getSnapshotPath(name, context, extension)

  return fsp
    .readFile(snapshotPath)
    .catch(() => null)
    .then((file) =>
      file == null ? null : file.toString()
    )
}

/**
 * Write snapshot to the file system.
 *
 * @param {String} snapshot - snapshot to be writtn
 * @param {String} name - snapshot name
 * @param {String} context - context name
 * @param {String} [extension='html'] - file extension
 * @returns {Promise}
 */
function writeSnapshot (snapshot, name, context, extension = 'html') {
  const dir = path.join(defaultSnapshotsDir, context || '')
  const snapshotPath = getSnapshotPath(name, context, extension)

  return fsp
    .ensureDir(dir)
    .then(() => fsp.writeFile(snapshotPath, snapshot))
}

/**
 * Build full page snapshot from HTML and CSS snapshots.
 *
 * @param {String} html
 * @param {String} css
 * @returns {String} HTML and CSS snapshots combined
 */
function buildPage (html, css) {
  if (!css) {
    return html
  }

  return ['<style>']
    .concat(css)
    .concat('</style>')
    .concat('')
    .concat(html)
    .join('\n')
}

function getSnapshotPath (scenarioName, contextName, extension) {
  const dir = path.join(defaultSnapshotsDir, contextName || '')
  return `${dir}/${composeScenarioFileName(scenarioName, contextName, extension)}`
}

function composeScenarioFileName (name, context, extension) {
  const fileName = context ? [context, name].join(CONTEXT_DELIMITER) : name
  return fileName + (extension ? '.' + extension : '')
}

module.exports = {
  readSnapshot,
  writeSnapshot,
  buildPage
}
