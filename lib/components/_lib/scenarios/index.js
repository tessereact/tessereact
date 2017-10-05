'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chunk2 = require('lodash/chunk');

var _chunk3 = _interopRequireDefault(_chunk2);

exports.findScenario = findScenario;
exports.getChunksToLoad = getChunksToLoad;
exports.acceptScenario = acceptScenario;
exports.resolveScenario = resolveScenario;
exports.changeScenarioScreenshotData = changeScenarioScreenshotData;
exports.requestScenarioAcceptance = requestScenarioAcceptance;

var _styles = require('../styles');

var _formatHTML = require('../formatHTML');

var _formatHTML2 = _interopRequireDefault(_formatHTML);

var _diff = require('../diff');

var _buildScreenshotPage = require('../buildScreenshotPage');

var _buildScreenshotPage2 = _interopRequireDefault(_buildScreenshotPage);

var _detectBrowser = require('detect-browser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultScreenshotSizes = [{ width: 320, height: 568, alias: 'iPhone SE' }, { width: 1024, height: 768 }];

/**
 * Find a scenario by the name of the scenario and the name of its context.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {String} contextName
 * @param {String} scenarioName
 * @returns {ScenarioObject} wanted scenario
 */
function findScenario(scenarios, contextName, scenarioName) {
  return scenarios.find(function (s) {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName;
    } else {
      return s.name === scenarioName && !s.context;
    }
  });
}

function findScenarioIndex(scenarios, contextName, scenarioName) {
  return scenarios.findIndex(function (s) {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName;
    } else {
      return s.name === scenarioName && !s.context;
    }
  });
}

/**
 * Prepare scenario array to be sent to the server,
 * move selected scenario(s) to the start of the array if there are any,
 * split the array by chunks of the selected size.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 * @param {Number} [chunkSize]
 * @returns {Array<ScenarioObject>} scenario array prepared to be sent to server
 */
function getChunksToLoad(routeData, scenarios) {
  var chunkSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var _routeData$params = routeData.params,
      contextName = _routeData$params.context,
      name = _routeData$params.scenario,
      routeName = routeData.route.name;


  var context = contextName === 'null' ? null : contextName;
  if (routeName === 'scenario') {
    return shiftScenario(scenarios, context, name, chunkSize);
  } else if (routeName === 'context') {
    return shiftContext(scenarios, context, chunkSize);
  } else {
    return (0, _chunk3.default)(scenarios, chunkSize);
  }
}

function shiftScenario(scenarios, contextName, scenarioName, chunkSize) {
  var scenario = findScenario(scenarios, contextName, scenarioName);

  if (!scenario) {
    return scenarios;
  }

  return [[scenario]].concat(_toConsumableArray((0, _chunk3.default)(scenarios.filter(function (s) {
    return s.name !== scenarioName || s.context !== contextName;
  }), chunkSize)));
}

function shiftContext(scenarios, contextName, chunkSize) {
  return [].concat(_toConsumableArray((0, _chunk3.default)(scenarios.filter(function (s) {
    return s.context === contextName;
  }), chunkSize)), _toConsumableArray((0, _chunk3.default)(scenarios.filter(function (s) {
    return s.context !== contextName;
  }), chunkSize)));
}

/**
 * Accept the scenario in the given scenario array and return the array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} acceptedScenario
 * @returns {Array<ScenarioObject>} new scenario array
 */
function acceptScenario(scenarios, acceptedScenario) {
  var scenarioIndex = findScenarioIndex(scenarios, acceptedScenario.context, acceptedScenario.name);

  var scenario = scenarios[scenarioIndex];

  return Object.assign([], scenarios, _defineProperty({}, scenarioIndex, Object.assign({}, acceptedScenario, {
    previousSnapshot: scenario.snapshot,
    snapshot: scenario.snapshot,
    hasDiff: false,
    screenshotData: null
  })));
}

/**
 * Calculate diffs for the scenario, using old snapshots received from the server.
 * Replace the scenario with the new version in the given scenario array and return the array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} scenario - scenario sent by the server
 * @param {Array<StyleObject>} styles - scenario sent by the server
 * @returns {Array<ScenarioObject>} new scenario array
 */
function resolveScenario(scenarios, scenario, styles) {
  var diffCSS = void 0;
  var screenshotData = void 0;

  var name = scenario.name,
      context = scenario.context,
      oldSnapshot = scenario.snapshot,
      oldSnapshotCSS = scenario.snapshotCSS;


  var storedScenarioIndex = findScenarioIndex(scenarios, context, name);

  var storedScenario = scenarios[storedScenarioIndex];

  var element = storedScenario.getElement();

  var snapshot = (0, _formatHTML2.default)(storedScenario.getSnapshot());
  var snapshotCSS = storedScenario.options.css ? (0, _styles.buildSnapshotCSS)(styles, document.getElementById((0, _styles.generateScenarioId)(storedScenario)), document.documentElement, document.body) : null;

  var diff = (0, _diff.diffToHTML)((0, _diff.diffSnapshots)('HTML', oldSnapshot, snapshot));

  if (storedScenario.options.css) {
    diffCSS = (0, _diff.diffToHTML)((0, _diff.diffSnapshots)('CSS', oldSnapshotCSS, snapshotCSS));

    if (storedScenario.options.screenshot && (diff || diffCSS)) {
      screenshotData = {
        before: (0, _buildScreenshotPage2.default)(oldSnapshot, oldSnapshotCSS),
        after: (0, _buildScreenshotPage2.default)(snapshot, snapshotCSS),
        screenshotSizes: window.__tessereactConfig && window.__tessereactConfig.screenshotSizes || defaultScreenshotSizes
      };
    }
  }

  return Object.assign([], scenarios, _defineProperty({}, storedScenarioIndex, {
    name: name,
    context: context,
    element: element,
    diff: diff,
    diffCSS: diffCSS,
    hasDiff: diff || diffCSS,
    snapshot: snapshot,
    snapshotCSS: snapshotCSS,
    status: 'resolved',
    screenshotData: screenshotData
  }));
}

/**
 * Run callback on screenshotData of a specific scenario,
 * merge the result of the function with screenshotData
 * and return the resulting scenario array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} scenario
 * @param {Function} callback
 * @returns {Array<ScenarioObject>} new scenario array
 */
function changeScenarioScreenshotData(scenarios, scenario, callback) {
  var storedScenarioIndex = findScenarioIndex(scenarios, scenario.context, scenario.name);

  var storedScenario = scenarios[storedScenarioIndex];

  return Object.assign([], scenarios, _defineProperty({}, storedScenarioIndex, Object.assign({}, storedScenario, {
    screenshotData: Object.assign({}, storedScenario.screenshotData, callback(storedScenario.screenshotData))
  })));
}

/**
 * Prepare scenario to be sent to server for acceptance:
 * return only those fields of scenario object which are required by the server.
 *
 * @param {ScenarioObject} scenario
 * @returns {ScenarioObject} scenario prepared to be sent to server
 */
function requestScenarioAcceptance(scenario) {
  var payload = {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot,
    snapshotCSS: scenario.snapshotCSS,
    screenshotData: scenario.screenshotData,
    browserData: (0, _detectBrowser.detect)()
  };

  return payload;
}