'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _styledHighligthedDiff = require('./styled/HighligthedDiff');

var _styledHighligthedDiff2 = _interopRequireDefault(_styledHighligthedDiff);

// TODO: Change to smth reasonable
var React = require('react');
var lodash = require('lodash');
var classnames = require('classnames');

var DELIMETER = '+++';

var Formatter = React.createClass({
  displayName: 'Formatter',

  render: function render() {
    return React.createElement(
      'pre',
      null,
      lodash.flatten(this._nodes()).map(function (n, i) {
        return React.createElement(
          _styledHighligthedDiff2['default'],
          { key: i, added: n.added, removed: n.removed },
          (n.tag ? lodash.pad('', n.indent) : '') + n.value,
          n.tag && React.createElement('br', null)
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
exports.Formatter = Formatter;