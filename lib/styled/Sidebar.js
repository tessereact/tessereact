'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  flex-basis: ', ';\n  padding: 10px;\n  color: #333;\n  text-align: left;\n  max-height: 100vh;\n  overflow-y: auto;\n'], ['\n  flex-basis: ', ';\n  padding: 10px;\n  color: #333;\n  text-align: left;\n  max-height: 100vh;\n  overflow-y: auto;\n']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mixinsDefault = require('./mixins/default');

var _mixinsDefault2 = _interopRequireDefault(_mixinsDefault);

var Sidebar = _styledComponents2['default'].div(_templateObject, function (props) {
  return props.right ? '35%' : '15%';
});

exports['default'] = (0, _mixinsDefault2['default'])(Sidebar);
module.exports = exports['default'];