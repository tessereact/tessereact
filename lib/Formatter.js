'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BottomPane = require('./styled/BottomPane');

var _BottomPane2 = _interopRequireDefault(_BottomPane);

var _HighligthedDiff = require('./styled/HighligthedDiff');

var _HighligthedDiff2 = _interopRequireDefault(_HighligthedDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Formatter = _react2.default.createClass({
  displayName: 'Formatter',
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
            'Previous version'
          ),
          _react2.default.createElement(
            _BottomPane2.default.ColumnBody,
            null,
            (0, _flatten3.default)(this.props.nodes).map(function (n, i) {
              return !n.added && _react2.default.createElement(
                _HighligthedDiff2.default,
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
            'Current version'
          ),
          _react2.default.createElement(
            _BottomPane2.default.ColumnBody,
            null,
            (0, _flatten3.default)(this.props.nodes).map(function (n, i) {
              return !n.removed && _react2.default.createElement(
                _HighligthedDiff2.default,
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

exports.default = Formatter;