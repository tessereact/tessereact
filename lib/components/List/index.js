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
    selectedNode: _react.PropTypes.object,
    selectNode: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string
  },

  _renderItem: function _renderItem(node) {
    return node.children ? this._renderContext(node) : this._renderScenario(node);
  },
  _renderContext: function _renderContext(node) {
    var _props = this.props,
        selectedNode = _props.selectedNode,
        searchQuery = _props.searchQuery,
        selectNode = _props.selectNode;


    return _react2.default.createElement(_Context2.default, {
      key: node.name,
      node: node,
      selectedNode: selectedNode,
      selectNode: selectNode,
      searchQuery: searchQuery
    });
  },
  _renderScenario: function _renderScenario(node) {
    var _props2 = this.props,
        selectNode = _props2.selectNode,
        selectedNode = _props2.selectedNode,
        searchQuery = _props2.searchQuery,
        child = _props2.child;


    return _react2.default.createElement(_Scenario2.default, {
      key: [node.context, node.name].join(' - '),
      node: node,
      selectNode: selectNode,
      selectedNode: selectedNode,
      searchQuery: searchQuery,
      child: child
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