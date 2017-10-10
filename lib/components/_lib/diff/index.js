'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHTMLDiff = getHTMLDiff;
exports.getCSSDiff = getCSSDiff;
exports.getTextDiff = getTextDiff;

var _difflib = require('difflib');

var _difflib2 = _interopRequireDefault(_difflib);

var _diff2html = require('diff2html');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get HTML diff from a scenario
 *
 * @param {ScenarioObject} scenario
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
function getHTMLDiff(scenario) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var snapshot = scenario.snapshot,
      oldSnapshot = scenario.oldSnapshot;

  return diffToHTML(diffSnapshots('HTML', oldSnapshot, snapshot), options);
}

/**
 * Get CSS diff from a scenario
 *
 * @param {ScenarioObject} scenario
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
function getCSSDiff(scenario) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var snapshotCSS = scenario.snapshotCSS,
      oldSnapshotCSS = scenario.oldSnapshotCSS;

  return diffToHTML(diffSnapshots('CSS', oldSnapshotCSS, snapshotCSS), options);
}

/**
 * Get diff in text format from a scenario
 *
 * @param {ScenarioObject} scenario
 * @returns {String} - diff in text format
 */
function getTextDiff(scenario) {
  var snapshot = scenario.snapshot,
      oldSnapshot = scenario.oldSnapshot,
      snapshotCSS = scenario.snapshotCSS,
      oldSnapshotCSS = scenario.oldSnapshotCSS;

  return [diffSnapshots('HTML', oldSnapshot, snapshot), diffSnapshots('CSS', oldSnapshotCSS, snapshotCSS)].filter(function (x) {
    return x;
  }).join('\n\n');
}

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
 * @param {Object} [options]
 * @param {Boolean} [options.twoColumns = false]
 * @returns {String} - diff in HTML format
 */
function diffToHTML(diff) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!diff) {
    return '';
  }

  return _diff2html.Diff2Html.getPrettyHtml(diff, {
    outputFormat: options.twoColumns ? 'side-by-side' : 'line-by-line'
  });
}