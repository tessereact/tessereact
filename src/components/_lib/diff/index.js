import difflib from 'difflib'
import { Diff2Html } from 'diff2html'

/**
 * Get HTML diff from a scenario
 *
 * @param {ScenarioObject} scenario
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
export function getHTMLDiff (scenario, options = {}) {
  const {snapshot, oldSnapshot} = scenario
  return diffToHTML(diffSnapshots('HTML', oldSnapshot, snapshot), options)
}

/**
 * Get CSS diff from a scenario
 *
 * @param {ScenarioObject} scenario
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
export function getCSSDiff (scenario, options = {}) {
  const {snapshotCSS, oldSnapshotCSS} = scenario
  return diffToHTML(diffSnapshots('CSS', oldSnapshotCSS, snapshotCSS), options)
}

/**
 * Get diff in text format from a scenario
 *
 * @param {ScenarioObject} scenario
 * @returns {String} - diff in text format
 */
export function getTextDiff (scenario) {
  const {snapshot, oldSnapshot, snapshotCSS, oldSnapshotCSS} = scenario
  return [
    diffSnapshots('HTML', oldSnapshot, snapshot),
    diffSnapshots('CSS', oldSnapshotCSS, snapshotCSS)
  ].filter(x => x).join('\n\n')
}

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
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
function diffToHTML (diff, options = {}) {
  if (!diff) {
    return ''
  }

  return Diff2Html.getPrettyHtml(
    diff, {
      outputFormat: options.twoColumns ? 'side-by-side' : 'line-by-line'
    }
  )
}
