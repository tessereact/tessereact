'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _pad2 = require('lodash/pad');

var _pad3 = _interopRequireDefault(_pad2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HighligthedDiff = require('./styled/HighligthedDiff');

var _HighligthedDiff2 = _interopRequireDefault(_HighligthedDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Change to smth reasonable
var DELIMETER = '+++';

// TODO: Rewrite it properly
var Formatter = _react2.default.createClass({
  displayName: 'Formatter',
  render: function render() {
    return _react2.default.createElement(
      'pre',
      null,
      (0, _flatten3.default)(this._nodes()).map(function (n, i) {
        return _react2.default.createElement(
          _HighligthedDiff2.default,
          { key: i, added: n.added, removed: n.removed },
          (n.tag ? (0, _pad3.default)('', n.indent) : '') + n.value,
          n.tag && _react2.default.createElement('br', null)
        );
      })
    );
  },
  _nodes: function _nodes() {
    var indent = 0;
    return this.props.nodes.map(function (n, i) {
      return n.value.replace(/></g, '>' + DELIMETER + '<').split(DELIMETER).map(function (el) {
        // TODO: Rewrite it so it actually works :D
        if (el.slice(0, 2) === '</') {
          indent = indent - 2;
        } else if (el[0] === '<') {
          indent = indent + 2;
        }

        return {
          value: el,
          added: n.added,
          removed: n.removed,
          tag: !!el.match('>'),
          indent: indent
        };
      });
    });
  }
});

exports.default = Formatter;