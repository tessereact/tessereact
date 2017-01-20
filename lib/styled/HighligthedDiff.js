'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background: ', '\n  background: ', '\n'], ['\n  background: ', '\n  background: ', '\n']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mixinsDefault = require('./mixins/default');

var _mixinsDefault2 = _interopRequireDefault(_mixinsDefault);

var HighligthedDiff = _styledComponents2['default'].span(_templateObject, function (props) {
  return props.added && '#d8ffd8';
}, function (props) {
  return props.removed && '#ffb0b0';
});

exports['default'] = (0, _mixinsDefault2['default'])(HighligthedDiff);
module.exports = exports['default'];