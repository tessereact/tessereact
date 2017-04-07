'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _FilterInput = require('../../styled/FilterInput');

var _FilterInput2 = _interopRequireDefault(_FilterInput);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Navigation = _react2.default.createClass({
  displayName: 'Navigation',

  propTypes: {
    failedScenariosCount: _react.PropTypes.number,
    scenariosCount: _react.PropTypes.number,
    nodes: _react.PropTypes.array
  },

  getInitialState: function getInitialState() {
    return {
      searchQuery: ''
    };
  },
  _handleFilter: function _handleFilter(event) {
    this.setState({ searchQuery: event.target.value });
  },
  _renderFailed: function _renderFailed() {
    return this.props.failedScenariosCount > 0 && _react2.default.createElement(
      _Sidebar2.default.Failed,
      null,
      'FAILED (',
      this.props.failedScenariosCount,
      '/',
      this.props.scenariosCount,
      ')'
    );
  },
  render: function render() {
    return _react2.default.createElement(
      _Sidebar2.default,
      null,
      _react2.default.createElement(
        _reactRouterDom.Link,
        { to: '/', style: { textDecoration: 'none' } },
        _react2.default.createElement(
          _Sidebar2.default.Header,
          null,
          'Testshot'
        )
      ),
      _react2.default.createElement(
        _Sidebar2.default.SearchBox,
        null,
        _react2.default.createElement(_FilterInput2.default, { placeholder: 'Search', ref: this.state.searchQuery, onChange: this._handleFilter })
      ),
      _react2.default.createElement(
        _Sidebar2.default.List,
        null,
        this._renderFailed(),
        _react2.default.createElement(_List2.default, {
          nodes: this.props.nodes,
          searchQuery: this.state.searchQuery
        })
      )
    );
  }
});

exports.default = Navigation;