'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _utils = require('../_lib/utils');

var _ScenarioNavLink = require('../../styled/ScenarioNavLink');

var _ScenarioNavLink2 = _interopRequireDefault(_ScenarioNavLink);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scenario = _react2.default.createClass({
  displayName: 'Scenario',

  propTypes: {
    node: _react.PropTypes.object,
    searchQuery: _react.PropTypes.string,
    child: _react.PropTypes.bool
  },

  render: function render() {
    var _props = this.props,
        searchQuery = _props.searchQuery,
        child = _props.child,
        _props$node = _props.node,
        name = _props$node.name,
        context = _props$node.context,
        hasDiff = _props$node.hasDiff;

    var params = { context: context || 'null', scenario: name };
    var path = _routes2.default.hrefTo('scenario', params);

    return (0, _utils.matchesQuery)(searchQuery, name) && _react2.default.createElement(
      _Sidebar2.default.ListItem,
      { key: name },
      _react2.default.createElement(
        _ScenarioNavLink2.default,
        {
          name: 'scenario',
          params: params,
          hasDiff: hasDiff,
          child: child,
          active: _routes2.default.isPathMatchesRouteOrParents(path)
        },
        name
      )
    );
  }
});

exports.default = Scenario;