'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findScenario = findScenario;
exports.getScenariosToLoad = getScenariosToLoad;
exports.acceptScenario = acceptScenario;
exports.resolveScenario = resolveScenario;
exports.changeScenarioScreenshotData = changeScenarioScreenshotData;
exports.requestScenarioAcceptance = requestScenarioAcceptance;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
 * move selected scenario(s) to the start of the array if there are any.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 * @returns {Array<ScenarioObject>} scenario array prepared to be sent to server
 */
function getScenariosToLoad(routeData, scenarios) {
  var _routeData$params = routeData.params,
      contextName = _routeData$params.context,
      name = _routeData$params.scenario,
      routeName = routeData.route.name;


  var context = contextName === 'null' ? null : contextName;
  if (routeName === 'scenario') {
    return shiftScenario(scenarios, context, name);
  } else if (routeName === 'context') {
    return shiftContext(scenarios, context);
  } else {
    return scenarios;
  }
}

function shiftScenario(scenarios, contextName, scenarioName) {
  var scenario = findScenario(scenarios, contextName, scenarioName);

  if (!scenario) {
    return scenarios;
  }

  return [scenario].concat(scenarios.filter(function (s) {
    return s.name !== scenarioName || s.context !== contextName;
  }));
}

function shiftContext(scenarios, contextName) {
  return scenarios.filter(function (s) {
    return s.context === contextName;
  }).concat(scenarios.filter(function (s) {
    return s.context !== contextName;
  }));
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
 * Replace scenario with the new version sent by the server
 * in the given scenario array and return the array.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @param {ScenarioObject} scenario - scenario sent by the server
 * @returns {Array<ScenarioObject>} new scenario array
 */
function resolveScenario(scenarios, scenario) {
  var storedScenarioIndex = findScenarioIndex(scenarios, scenario.context, scenario.name);

  var storedScenario = scenarios[storedScenarioIndex];

  return Object.assign([], scenarios, _defineProperty({}, storedScenarioIndex, {
    name: scenario.name,
    context: scenario.context,
    element: storedScenario.getElement(),
    diff: scenario.diff,
    diffCSS: scenario.diffCSS,
    hasDiff: scenario.diff || scenario.diffCSS,
    snapshot: scenario.snapshot,
    snapshotCSS: scenario.snapshotCSS,
    status: 'resolved',
    screenshotData: scenario.screenshotData
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
    screenshotData: scenario.screenshotData
  };

  return payload;
}