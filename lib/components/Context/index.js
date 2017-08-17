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

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Arrow = require('../../styled/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _ContextNavLink = require('../../styled/ContextNavLink');

var _ContextNavLink2 = _interopRequireDefault(_ContextNavLink);

var _utils = require('../_lib/utils');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Context = _react2.default.createClass({
  displayName: 'Context',

  propTypes: {
    node: _react.PropTypes.object,
    selectedNode: _react.PropTypes.object,
    selectNode: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string,
    location: _react.PropTypes.object
  },

  _hasFailingChildren: function _hasFailingChildren() {
    return this.props.node.children.find(function (_ref) {
      var hasDiff = _ref.hasDiff;
      return hasDiff;
    });
  },
  _shouldExpand: function _shouldExpand() {
    return window.location.pathname.match('/contexts/' + this.props.node.name) || this._hasFailingChildren() || this._applyFilter() && this._searchMatchChildren();
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
  _renderIcon: function _renderIcon() {
    return this._shouldExpand() ? _react2.default.createElement(_Arrow2.default.Down, null) : _react2.default.createElement(_Arrow2.default.Right, null);
  },
  render: function render() {
    var _this2 = this;

    var _props$node = this.props.node,
        name = _props$node.name,
        children = _props$node.children;

    var path = _routes2.default.hrefTo('context', { context: name });

    // If context's name matches filter, render all children.
    // Otherwise, filter them by query or selected
    var filteredChildren = this._matchFilter() ? children : children.filter(function (scenario) {
      var childPath = _routes2.default.hrefTo('scenario', { context: name, scenario: scenario.name });
      return (0, _utils.matchesQuery)(_this2.props.searchQuery, scenario.name) || _routes2.default.isPathMatchesRouteOrParents(childPath);
    });

    var hasSelectedChildren = _routes2.default.isPathMatchesRouteOrParentsOrChildren(path);
    var active = _routes2.default.isPathMatchesRouteOrParents(path);

    return (hasSelectedChildren || filteredChildren.length > 0) && _react2.default.createElement(
      _Sidebar2.default.ListItem,
      { key: name },
      _react2.default.createElement(
        _ContextNavLink2.default,
        {
          name: 'context',
          params: { context: name },
          active: active
        },
        this._renderIcon(),
        _react2.default.createElement(
          'span',
          { ref: function ref(_ref2) {
              return _ref2 && active && _ref2.scrollIntoViewIfNeeded && _ref2.scrollIntoViewIfNeeded();
            } },
          name
        )
      ),
      this._shouldExpand() && _react2.default.createElement(_List2.default, { nodes: filteredChildren, child: true })
    );
  }
});

exports.default = Context;