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

var _utils = require('../_lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Context = _react2.default.createClass({
  displayName: 'Context',

  propTypes: {
    node: _react.PropTypes.object,
    selectedScenario: _react.PropTypes.object,
    selectScenario: _react.PropTypes.func,
    searchQuery: _react.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      expanded: false
    };
  },
  _hasFailingChildren: function _hasFailingChildren() {
    return this.props.node.children.find(function (_ref) {
      var hasDiff = _ref.hasDiff;
      return hasDiff;
    });
  },
  _shouldExpand: function _shouldExpand() {
    return this.state.expanded || this._hasFailingChildren() || this._applyFilter();
  },
  _applyFilter: function _applyFilter() {
    return this.props.searchQuery.length >= _utils.SEARCH_LIMIT;
  },
  _matchFilter: function _matchFilter() {
    var _this = this;

    return (0, _utils.matchesQuery)(this.props.searchQuery, this.props.node.name) || (0, _some3.default)(this.props.node.children, function (child) {
      return (0, _utils.matchesQuery)(_this.props.searchQuery, child.name);
    });
  },
  render: function render() {
    var _this2 = this;

    console.log('isNodeActive', (0, _utils.isNodeActive)(this.props.selectedScenario, this.props.node));
    return this._matchFilter() && _react2.default.createElement(
      'li',
      { key: this.props.node.name },
      _react2.default.createElement(
        _ContextLink2.default,
        {
          hasDiff: this.props.node.hasDiff,
          active: (0, _utils.isNodeActive)(this.props.selectedScenario, this.props.node),
          onClick: function onClick() {
            return _this2.setState({ expanded: !_this2.state.expanded });
          }
        },
        '\u203A ',
        this.props.node.name
      ),
      this._shouldExpand() && _react2.default.createElement(_List2.default, { nodes: this.props.node.children, child: true, selectedScenario: this.props.selectedScenario, selectScenario: this.props.selectScenario })
    );
  }
});

exports.default = Context;