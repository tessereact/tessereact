'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Context = require('../Context');

var _Context2 = _interopRequireDefault(_Context);

var _Scenario = require('../Scenario');

var _Scenario2 = _interopRequireDefault(_Scenario);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var List = _react2.default.createClass({
  displayName: 'List',

  propTypes: {
    nodes: _react.PropTypes.array,
    child: _react.PropTypes.bool,
    selectedScenario: _react.PropTypes.object,
    selectScenario: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string
  },

  _renderItem: function _renderItem(node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node);
  },
  _renderContext: function _renderContext(node) {
    return _react2.default.createElement(_Context2.default, {
      key: node.name,
      node: node,
      selectedScenario: this.props.selectedScenario,
      selectScenario: this.props.selectScenario,
      searchQuery: this.props.searchQuery
    });
  },
  _renderScenario: function _renderScenario(node) {
    return _react2.default.createElement(_Scenario2.default, {
      key: [node.context, node.name].join(' - '),
      node: node,
      selectScenario: this.props.selectScenario,
      selectedScenario: this.props.selectedScenario,
      searchQuery: this.props.searchQuery,
      child: this.props.child
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'ul',
      null,
      this.props.nodes.map(this._renderItem)
    );
  }
});

exports.default = List;