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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scenario = _react2.default.createClass({
  displayName: 'Scenario',

  propTypes: {
    node: _react.PropTypes.object,
    searchQuery: _react.PropTypes.string,
    child: _react.PropTypes.bool
  },

  _makeURL: function _makeURL() {
    return '/contexts/' + this.props.node.context + '/scenarios/' + this.props.node.name;
  },
  render: function render() {
    return (0, _utils.matchesQuery)(this.props.searchQuery, this.props.node.name) && _react2.default.createElement(
      _Sidebar2.default.ListItem,
      { key: this.props.node.name },
      _react2.default.createElement(
        _ScenarioNavLink2.default,
        { to: this._makeURL(),
          hasDiff: this.props.node.hasDiff,
          child: this.props.child
        },
        this.props.node.name
      )
    );
  }
});

exports.default = Scenario;