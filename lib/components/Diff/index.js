'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BottomPane = require('../../styled/BottomPane');

var _BottomPane2 = _interopRequireDefault(_BottomPane);

var _HighlightedDiff = require('../../styled/HighlightedDiff');

var _HighlightedDiff2 = _interopRequireDefault(_HighlightedDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Diff = _react2.default.createClass({
  displayName: 'Diff',

  propTypes: {
    nodes: _react.PropTypes.array
  },

  getInitialState: function getInitialState() {
    return {
      collapsed: true
    };
  },


  // This method is responsible for collape/expand functionality
  _getNodes: function _getNodes() {
    if (!this.state.collapsed) {
      return this.props.nodes;
    }
    return this.props.nodes.map(function (n, i) {
      var newNode = Object.assign({}, n);
      var showedRows = void 0;
      var rows = n.value.split('\n');
      if (n.removed || n.added) {
        showedRows = rows;
      } else if (i === 0) {
        showedRows = ['...'].concat(rows.slice(rows.length - 1, rows.length));
      } else if (i === rows.length - 1) {
        showedRows = rows.slice(0, 1).concat(['...']);
      } else if (rows.length > 1) {
        showedRows = rows.slice(0, 1).concat('...').concat(rows.slice(rows.length - 1, rows.length));
      } else {
        showedRows = rows;
      }
      newNode.value = showedRows.join('\n');
      return newNode;
    });
  },
  _toggleCollapsed: function _toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  },
  _renderCollapseButton: function _renderCollapseButton() {
    return _react2.default.createElement(
      _BottomPane2.default.CollapseButton,
      { onClick: this._toggleCollapsed },
      this.state.collapsed ? 'Expand' : 'Collapse'
    );
  },
  render: function render() {
    return _react2.default.createElement(
      _BottomPane2.default,
      null,
      _react2.default.createElement(
        _BottomPane2.default.Row,
        null,
        _react2.default.createElement(
          _BottomPane2.default.Column,
          null,
          _react2.default.createElement(
            _BottomPane2.default.ColumnHeader,
            null,
            _react2.default.createElement(
              _BottomPane2.default.Text,
              null,
              'Previous version'
            )
          ),
          _react2.default.createElement(
            _BottomPane2.default.ColumnBody,
            null,
            (0, _flatten3.default)(this._getNodes()).map(function (n, i) {
              return !n.added && _react2.default.createElement(
                _HighlightedDiff2.default,
                { key: i, removed: n.removed },
                n.value
              );
            })
          )
        ),
        _react2.default.createElement(
          _BottomPane2.default.Column,
          null,
          _react2.default.createElement(
            _BottomPane2.default.ColumnHeader,
            null,
            _react2.default.createElement(
              _BottomPane2.default.Text,
              null,
              'Current version'
            ),
            this._renderCollapseButton()
          ),
          _react2.default.createElement(
            _BottomPane2.default.ColumnBody,
            null,
            (0, _flatten3.default)(this._getNodes()).map(function (n, i) {
              return !n.removed && _react2.default.createElement(
                _HighlightedDiff2.default,
                { key: i, added: n.added },
                n.value
              );
            })
          )
        )
      )
    );
  }
});

exports.default = Diff;