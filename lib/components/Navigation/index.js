'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _Header = require('../../styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _FilterInput = require('../../styled/FilterInput');

var _FilterInput2 = _interopRequireDefault(_FilterInput);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Navigation = _react2.default.createClass({
  displayName: 'Navigation',

  propTypes: {
    nodes: _react.PropTypes.array,
    selectedScenario: _react.PropTypes.object,
    selectScenario: _react.PropTypes.func
  },

  getInitialState: function getInitialState() {
    return {
      searchQuery: ''
    };
  },
  _handleFilter: function _handleFilter(event) {
    this.setState({ searchQuery: event.target.value });
  },
  render: function render() {
    return _react2.default.createElement(
      _Sidebar2.default,
      null,
      _react2.default.createElement(
        _Header2.default,
        null,
        'Scenarios'
      ),
      _react2.default.createElement(_FilterInput2.default, { ref: this.state.searchQuery, onChange: this._handleFilter }),
      _react2.default.createElement(_List2.default, {
        nodes: this.props.nodes,
        selectScenario: this.props.selectScenario,
        selectedScenario: this.props.selectedScenario,
        searchQuery: this.state.searchQuery
      })
    );
  }
});

exports.default = Navigation;