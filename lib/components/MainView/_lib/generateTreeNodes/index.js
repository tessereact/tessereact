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

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

exports.default = generateTreeNodes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert scenario array to the tree consumed by Navigation or List element.
 *
 * @param {Array<ScenarioObject>} scenarios
 * @returns {Array<ContextObject|ScenarioObject>} tree of contexts and scenarios
 */
function generateTreeNodes(scenarios) {
  var groupedByContext = (0, _groupBy3.default)(scenarios, 'context');
  var contextsOnly = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k !== 'null';
  });
  var plainScenarios = (0, _pickBy3.default)(groupedByContext, function (v, k) {
    return k === 'null';
  })['null'];
  var result = (0, _map3.default)(contextsOnly, function (value, key) {
    var children = extractProperties(value);
    return { name: key, children: children, hasDiff: (0, _some3.default)(children, function (c) {
        return c.hasDiff;
      }) };
  }).concat(extractProperties(plainScenarios));
  return (0, _sortBy3.default)(result, sortByContextName).sort(sortingNodes);
}

function extractProperties(children) {
  return children ? children.map(function (c) {
    return (0, _pick3.default)(c, ['name', 'hasDiff', 'context']);
  }) : [];
}

function sortingNodes(node1, node2) {
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

function sortByContextName(node) {
  return node.context || -1;
}