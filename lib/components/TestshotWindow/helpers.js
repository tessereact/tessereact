'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _groupBy2 = require('lodash/groupBy');

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

exports.pickFailingScenario = pickFailingScenario;
exports.buildInitialState = buildInitialState;
exports.requestScenariosList = requestScenariosList;
exports.requestScenarioAcceptance = requestScenarioAcceptance;
exports.mergeWithPayload = mergeWithPayload;
exports.acceptCurrentScenario = acceptCurrentScenario;
exports.generateTreeNodes = generateTreeNodes;

var _formatter = require('../../lib/formatter/');

var _formatter2 = _interopRequireDefault(_formatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pickFailingScenario(state) {
  var newState = state;
  var failingScenario = (0, _find3.default)(state.scenarios, function (s) {
    return s.hasDiff;
  });
  if (failingScenario) {
    newState = Object.assign({}, state);
    newState.selectedNode = failingScenario;
  }
  return newState;
}

function buildInitialState(data) {
  var scenarios = data.map(function (f) {
    return f();
  });
  return {
    selectedNode: scenarios[0] || {},
    scenarios: scenarios
  };
}

function requestScenariosList(scenarios) {
  return {
    data: scenarios.map(function (s) {
      return { name: s.name, context: s.context };
    })
  };
}

function requestScenarioAcceptance(scenario) {
  return {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot
  };
}

function mergeWithPayload(state, payload) {
  var newData = state.scenarios.map(function (s) {
    var query = s.context ? { name: s.name, context: s.context } : { name: s.name };
    var storedScenario = (0, _find3.default)(payload, query) || {};
    s.previousSnapshot = storedScenario.previousSnapshot;
    s.snapshot = (0, _formatter2.default)(s.snapshot);
    s.hasDiff = s.snapshot !== s.previousSnapshot;
    s.isScenario = true;
    return s;
  });
  return { scenarios: newData };
}

function acceptCurrentScenario(state) {
  var newState = Object.assign({}, state);
  newState.selectedNode.previousSnapshot = newState.selectedNode.snapshot;
  newState.selectedNode.hasDiff = false;
  return newState;
}

function _extractProperties(children) {
  return children ? children.map(function (c) {
    return (0, _pick3.default)(c, ['name', 'hasDiff', 'context']);
  }) : [];
}

function generateTreeNodes(snapshots) {
  var groupedByContext = (0, _groupBy3.default)(snapshots, 'context');
  var contextsOnly = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k !== 'null';
  });
  var plainScenarios = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k === 'null';
  })['null'];
  return (0, _map3.default)(contextsOnly, function (value, key) {
    return { name: key, children: _extractProperties(value) };
  }).concat(_extractProperties(plainScenarios));
}