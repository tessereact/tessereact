'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffSnapshots = diffSnapshots;
exports.diffToHTML = diffToHTML;

var _difflib = require('difflib');

var _difflib2 = _interopRequireDefault(_difflib);

var _diff2html = require('diff2html');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Build a diff patch from two snapshots.
 *
 * @param {String} name - name of the file
 * @param {String} snapshotA
 * @param {String} snapshotB
 * @returns {String} patch file
 */
function diffSnapshots(name, snapshotA, snapshotB) {
  return _difflib2.default.unifiedDiff(snapshotA == null ? null : snapshotA.split('\n'), snapshotB == null ? null : snapshotB.split('\n'), {
    fromfile: name,
    tofile: name,
    lineterm: ''
  }).join('\n');
}

/**
 * Compile patch file into HTML markup to display on frontend.
 *
 * @param {String} diff - patch file
 * @returns {String} - diff in HTML format
 */
function diffToHTML(diff) {
  if (!diff) {
    return '';
  }

  return _diff2html.Diff2Html.getPrettyHtml(diff);
}