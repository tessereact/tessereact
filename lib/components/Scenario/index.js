'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ScenarioLink = require('../../styled/ScenarioLink');

var _ScenarioLink2 = _interopRequireDefault(_ScenarioLink);

var _utils = require('../_lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scenario = _react2.default.createClass({
  displayName: 'Scenario',

  propTypes: {
    node: _react.PropTypes.object,
    selectedScenario: _react.PropTypes.shape({
      name: _react.PropTypes.string.isRequired,
      context: _react.PropTypes.string
    }).isRequired,
    selectScenario: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string,
    child: _react.PropTypes.bool
  },

  render: function render() {
    var _this = this;

    return (0, _utils.matchesQuery)(this.props.searchQuery, this.props.node.name) && _react2.default.createElement(
      'li',
      { key: this.props.node.name },
      _react2.default.createElement(
        _ScenarioLink2.default,
        {
          hasDiff: this.props.node.hasDiff,
          onClick: function onClick() {
            return _this.props.selectScenario(_this.props.node.name, _this.props.node.context);
          },
          active: (0, _utils.isNodeActive)(this.props.selectedScenario, this.props.node),
          child: this.props.child
        },
        this.props.node.name
      )
    );
  }
});

exports.default = Scenario;