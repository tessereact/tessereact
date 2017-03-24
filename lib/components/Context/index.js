'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _ContextLink = require('../../styled/ContextLink');

var _ContextLink2 = _interopRequireDefault(_ContextLink);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Arrow = require('../../styled/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _utils = require('../_lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Context = _react2.default.createClass({
  displayName: 'Context',

  propTypes: {
    node: _react.PropTypes.object,
    selectedNode: _react.PropTypes.object,
    selectNode: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string
  },

  _hasFailingChildren: function _hasFailingChildren() {
    return this.props.node.children.find(function (_ref) {
      var hasDiff = _ref.hasDiff;
      return hasDiff;
    });
  },
  _shouldExpand: function _shouldExpand() {
    return this.props.selectedNode.name === this.props.node.name || this.props.selectedNode.context === this.props.node.name || this._hasFailingChildren() || this._applyFilter() && this._searchMatchChildren();
  },
  _applyFilter: function _applyFilter() {
    return this.props.searchQuery.length >= _utils.SEARCH_LIMIT;
  },
  _matchFilter: function _matchFilter() {
    return (0, _utils.matchesQuery)(this.props.searchQuery, this.props.node.name);
  },
  _searchMatchChildren: function _searchMatchChildren() {
    var _this = this;

    return (0, _some3.default)(this.props.node.children, function (child) {
      return (0, _utils.matchesQuery)(_this.props.searchQuery, child.name);
    });
  },
  _handleClick: function _handleClick() {
    this.props.selectNode(this.props.node.name, null);
  },
  _renderIcon: function _renderIcon() {
    return this._shouldExpand() ? _react2.default.createElement(_Arrow2.default.Down, null) : _react2.default.createElement(_Arrow2.default.Right, null);
  },
  render: function render() {
    return this._matchFilter() && _react2.default.createElement(
      _Sidebar2.default.ListItem,
      { key: this.props.node.name },
      _react2.default.createElement(
        _ContextLink2.default,
        {
          hasDiff: this.props.node.hasDiff,
          active: (0, _utils.isNodeActive)(this.props.selectedNode, this.props.node),
          onClick: this._handleClick,
          title: this.props.node.name
        },
        this._renderIcon(),
        ' ',
        this.props.node.name
      ),
      this._shouldExpand() && _react2.default.createElement(_List2.default, { nodes: this.props.node.children, child: true, selectedNode: this.props.selectedNode, selectNode: this.props.selectNode })
    );
  }
});

exports.default = Context;