'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _groupBy2 = require('lodash/groupBy');

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _sortBy2 = require('lodash/sortBy');

var _sortBy3 = _interopRequireDefault(_sortBy2);

var _findIndex2 = require('lodash/findIndex');

var _findIndex3 = _interopRequireDefault(_findIndex2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

exports.requestScenarioAcceptance = requestScenarioAcceptance;
exports.acceptCurrentScenario = acceptCurrentScenario;
exports.resolveScenario = resolveScenario;
exports.findScenario = findScenario;
exports.findScenarioIndex = findScenarioIndex;
exports.generateTreeNodes = generateTreeNodes;
exports.shiftCurrentScenario = shiftCurrentScenario;
exports.shiftCurrentContext = shiftCurrentContext;
exports.onLoad = onLoad;
exports.toArray = toArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function requestScenarioAcceptance(scenario) {
  var payload = {
    name: scenario.name,
    context: scenario.context,
    snapshot: scenario.snapshot
  };

  if (scenario.snapshotCSS) {
    payload.snapshotCSS = scenario.snapshotCSS;
  }

  return payload;
}

function acceptCurrentScenario(state, scenario) {
  var newState = Object.assign({}, state);
  var newScenario = (0, _find3.default)(newState.scenarios, { name: scenario.name, context: scenario.context });
  newScenario.previousSnapshot = newScenario.snapshot;
  newScenario.hasDiff = false;
  newState.findNextFailingScenario = true;
  return newState;
}

function _extractProperties(children) {
  return children ? children.map(function (c) {
    return (0, _pick3.default)(c, ['name', 'hasDiff', 'context']);
  }) : [];
}

function _sortingNodes(node1, node2) {
  var node1HasDiff = node1.hasDiff || (0, _some3.default)(node1.children, function (c) {
    return c.hasDiff;
  });
  if (node1HasDiff) return -1;
  var node2HasDiff = node2.hasDiff || (0, _some3.default)(node2.children, function (c) {
    return c.hasDiff;
  });
  if (node2HasDiff) return 1;
  return 0;
}

function _sortByContextName(node) {
  return node.context || -1;
}

function resolveScenario(storedScenarios, scenario) {
  var storedScenarioIndex = findScenarioIndex(storedScenarios, scenario.context, scenario.name);

  var storedScenario = storedScenarios[storedScenarioIndex];

  return Object.assign([], storedScenarios, _defineProperty({}, storedScenarioIndex, {
    name: scenario.name,
    context: scenario.context,
    element: storedScenario.getElement(),
    diff: scenario.diff,
    hasDiff: scenario.diff,
    snapshot: scenario.snapshot,
    snapshotCSS: scenario.snapshotCSS,
    status: 'resolved'
  }));
}

function findScenario(scenarios, contextName, scenarioName) {
  return (0, _find3.default)(scenarios, function (s) {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName;
    } else {
      return s.name === scenarioName && !s.context;
    }
  });
}

function findScenarioIndex(scenarios, contextName, scenarioName) {
  return (0, _findIndex3.default)(scenarios, function (s) {
    if (contextName !== 'null') {
      return s.name === scenarioName && s.context === contextName;
    } else {
      return s.name === scenarioName && !s.context;
    }
  });
}

function generateTreeNodes(snapshots) {
  var groupedByContext = (0, _groupBy3.default)(snapshots, 'context');
  var contextsOnly = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k !== 'null';
  });
  var plainScenarios = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k === 'null';
  })['null'];
  var result = (0, _map3.default)(contextsOnly, function (value, key) {
    var children = _extractProperties(value);
    return { name: key, children: children, hasDiff: (0, _some3.default)(children, function (c) {
        return c.hasDiff;
      }) };
  }).concat(_extractProperties(plainScenarios));
  return (0, _sortBy3.default)(result, _sortByContextName).sort(_sortingNodes);
}

function shiftCurrentScenario(scenarios, _ref) {
  var name = _ref.name,
      context = _ref.context;

  var scenario = (0, _find3.default)(scenarios, { name: name, context: context });

  if (!scenario) {
    return scenarios;
  }

  return [scenario].concat((0, _filter3.default)(scenarios, function (s) {
    return s.name !== name || s.context !== context;
  }));
}

function shiftCurrentContext(scenarios, _ref2) {
  var context = _ref2.context;

  return (0, _filter3.default)(scenarios, function (s) {
    return s.context === context;
  }).concat((0, _filter3.default)(scenarios, function (s) {
    return s.context !== context;
  }));
}

function onLoad() {
  return new Promise(function (resolve, reject) {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

function toArray(object) {
  return Array.prototype.slice.call(object);
}