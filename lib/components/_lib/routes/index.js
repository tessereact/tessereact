'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfRouteExists = checkIfRouteExists;
exports.checkForHomeRoute = checkForHomeRoute;
exports.checkForHomeRouteDemoMode = checkForHomeRouteDemoMode;
exports.redirectToHome = redirectToHome;
exports.redirectToFirstFailingScenario = redirectToFirstFailingScenario;

var _history = require('../../../lib/router/history');

var _history2 = _interopRequireDefault(_history);

var _scenarios = require('../scenarios');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if scenario/context associated by given route doesn't exist.
 * In that case, redirect to the correct route.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
function checkIfRouteExists(routeData, scenarios) {
  var _routeData$params = routeData.params,
      context = _routeData$params.context,
      scenario = _routeData$params.scenario,
      routeName = routeData.route.name;


  switch (routeName) {
    case 'scenario':
      if (!(0, _scenarios.findScenario)(scenarios, context, scenario)) {
        if (!findContext(scenarios, context)) {
          _history2.default.push('/');
        } else {
          _history2.default.push('/contexts/' + context);
        }
      }
      break;
    case 'context':
      if (!findContext(scenarios, context)) {
        _history2.default.push('/');
      }
      break;
    case 'home':
    case 'demo':
      break;
    default:
      _history2.default.push('/');
  }
}

function findContext(scenarios, context) {
  return scenarios.find(function (s) {
    return s.context === context;
  });
}

/**
 * Check if the current route is home (/) and redirect to the first failing scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
function checkForHomeRoute(routeData, scenarios) {
  var routeName = routeData.route.name;

  if (routeName === 'home') {
    var scenario = scenarios.find(function (s) {
      return s.hasDiff;
    }) || scenarios[0];
    _history2.default.push('/contexts/' + scenario.context + '/scenarios/' + scenario.name);
  }
}

function redirectToFirstScenario(scenarios) {
  var scenario = (0, _scenarios.sortScenarios)(scenarios)[0];
  redirectToScenario(scenario);
}

/**
 * Check if the current route is home (/) and redirect to /demo.
 *
 * @param {RouteData} routeData
 */
function checkForHomeRouteDemoMode(routeData, scenarios) {
  var routeName = routeData.route.name;

  if (routeName === 'home') {
    _history2.default.push('/demo');
  }
}

/**
 * Redirect to home (/).
 *
 * @param {RouteData} routeData
 */
function redirectToHome(routeData, scenarios) {
  _history2.default.push('/');
}

/**
 * Redirect to the first failing scenario.
 * In the case when none of the scenarios is failing, redirect to the first scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<ScenarioObject>} scenarios
 */
function redirectToFirstFailingScenario(scenarios) {
  var scenario = (0, _scenarios.sortScenarios)(scenarios).find(function (s) {
    return s.hasDiff;
  });

  if (!scenario) {
    return redirectToFirstScenario(scenarios);
  }

  redirectToScenario(scenario);
}

function redirectToScenario(scenario) {
  var context = scenario.context,
      name = scenario.name;

  scenario && _history2.default.push('/contexts/' + context + '/scenarios/' + name);
}