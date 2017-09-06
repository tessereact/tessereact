'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfRouteExists = checkIfRouteExists;
exports.checkForHomeRoute = checkForHomeRoute;
exports.redirectToFirstFailingScenario = redirectToFirstFailingScenario;

var _history = require('../../../../lib/router/history');

var _history2 = _interopRequireDefault(_history);

var _scenarios = require('../scenarios');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if scenario/context associated by given route doesn't exist.
 * In that case, redirect to the correct route.
 *
 * @param {RouteData} routeData
 * @param {Array<Scenario>} scenarios
 */
function checkIfRouteExists(routeData, scenarios) {
  var _routeData$params = routeData.params,
      context = _routeData$params.context,
      scenario = _routeData$params.scenario,
      routeName = routeData.route.name;


  switch (routeName) {
    case 'scenario':
      !(0, _scenarios.findScenario)(scenarios, context, scenario) && _history2.default.push('/contexts/' + context);
      break;
    case 'context':
      !scenarios.find(function (s) {
        return s.context === context;
      }) && _history2.default.push('/');
      break;
    case 'home':
      break;
    default:
      _history2.default.push('/');
  }
}

/**
 * Check if the current route is home (/) and redirect to the first failing scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<Scenario>} scenarios
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
  var scenario = scenarios[0];
  redirectToScenario(scenario);
}

/**
 * Redirect to the first failing scenario.
 * In the case when none of the scenarios is failing, redirect to the first scenario.
 *
 * @param {RouteData} routeData
 * @param {Array<Scenario>} scenarios
 */
function redirectToFirstFailingScenario(scenarios) {
  var scenario = scenarios.find(function (s) {
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