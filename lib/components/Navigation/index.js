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

var _link = require('../../lib/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Navigation = _react2.default.createClass({
  displayName: 'Navigation',

  propTypes: {
    loadedScenariosCount: _react.PropTypes.number,
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
  _renderLoading: function _renderLoading() {
    var _props = this.props,
        loadedScenariosCount = _props.loadedScenariosCount,
        scenariosCount = _props.scenariosCount;


    return loadedScenariosCount !== scenariosCount && _react2.default.createElement(
      _Sidebar2.default.Progress,
      null,
      'LOADING (',
      loadedScenariosCount,
      '/',
      scenariosCount,
      ')'
    );
  },
  _renderFailed: function _renderFailed() {
    var _props2 = this.props,
        failedScenariosCount = _props2.failedScenariosCount,
        loadedScenariosCount = _props2.loadedScenariosCount,
        scenariosCount = _props2.scenariosCount;

    var showFailed = loadedScenariosCount === scenariosCount && failedScenariosCount > 0;

    return showFailed && _react2.default.createElement(
      _Sidebar2.default.Progress,
      null,
      'FAILED (',
      failedScenariosCount,
      '/',
      scenariosCount,
      ')'
    );
  },
  render: function render() {
    var searchQuery = this.state.searchQuery;
    var nodes = this.props.nodes;


    return _react2.default.createElement(
      _Sidebar2.default,
      null,
      _react2.default.createElement(
        _link2.default,
        { name: 'home', style: { textDecoration: 'none' } },
        _react2.default.createElement(
          _Sidebar2.default.Header,
          null,
          'Testshot'
        )
      ),
      _react2.default.createElement(
        _Sidebar2.default.SearchBox,
        null,
        _react2.default.createElement(_FilterInput2.default, { placeholder: 'Search', ref: searchQuery, onChange: this._handleFilter })
      ),
      _react2.default.createElement(
        _Sidebar2.default.List,
        null,
        this._renderLoading(),
        this._renderFailed(),
        _react2.default.createElement(_List2.default, {
          nodes: nodes,
          searchQuery: searchQuery
        })
      )
    );
  }
});

exports.default = Navigation;