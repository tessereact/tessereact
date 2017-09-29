import difflib from 'difflib'
import { Diff2Html } from 'diff2html'

/**
 * Build a diff patch from two snapshots.
 *
 * @param {String} name - name of the file
 * @param {String} snapshotA
 * @param {String} snapshotB
 * @returns {String} patch file
 */
export function diffSnapshots (name, snapshotA, snapshotB) {
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
export function diffToHTML (diff) {
  if (!diff) {
    return ''
  }

  return Diff2Html.getPrettyHtml(diff)
}
