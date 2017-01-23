'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styledHighligthedDiff = require('./styled/HighligthedDiff');

var _styledHighligthedDiff2 = _interopRequireDefault(_styledHighligthedDiff);

// TODO: Change to smth reasonable
var DELIMETER = '+++';

// TODO: Rewrite it properly
var Formatter = _react2['default'].createClass({
  displayName: 'Formatter',

  render: function render() {
    return _react2['default'].createElement(
      'pre',
      null,
      _lodash2['default'].flatten(this._nodes()).map(function (n, i) {
        return _react2['default'].createElement(
          _styledHighligthedDiff2['default'],
          { key: i, added: n.added, removed: n.removed },
          (n.tag ? _lodash2['default'].pad('', n.indent) : '') + n.value,
          n.tag && _react2['default'].createElement('br', null)
        );
      })
    );
  },

  _nodes: function _nodes() {
    var indent = 0;
    return this.props.nodes.map(function (n, i) {
      return n.value.replace(/\>\</g, '>' + DELIMETER + '<').split(DELIMETER).map(function (el) {
        // TODO: Rewrite it so it actually works :D
        if (el.slice(0, 2) == '</') {
          indent = indent - 2;
        } else if (el[0] == '<') {
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

exports['default'] = Formatter;
module.exports = exports['default'];