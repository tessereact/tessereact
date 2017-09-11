const difflib = require('difflib')
const { Diff2Html } = require('diff2html')

/**
 * Build a diff patch from two snapshots.
 *
 * @param {String} name - name of the file
 * @param {String} snapshotA
 * @param {String} snapshotB
 * @returns {String} patch file
 */
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

/**
 * Compile patch file into HTML markup to display on frontend.
 *
 * @param {String} diff - patch file
 * @returns {String} - diff in HTML format
 */
function diffToHTML (diff) {
  if (!diff) {
    return ''
  }

  return Diff2Html.getPrettyHtml(diff, {outputFormat: 'side-by-side'})
}

module.exports = {
  diffSnapshots,
  diffToHTML
}
