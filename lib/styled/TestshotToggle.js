'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: inline-block;\n  background: #33C3F0;\n  border-radius: 4px;\n  padding: 5px 10px;\n  color: white;\n  text-decoration: none;\n  text-transform: uppercase;\n  font-size: 11px;\n  position: fixed;\n  bottom: 5px;\n  right: 5px;\n  z-index: 10001;\n'], ['\n  display: inline-block;\n  background: #33C3F0;\n  border-radius: 4px;\n  padding: 5px 10px;\n  color: white;\n  text-decoration: none;\n  text-transform: uppercase;\n  font-size: 11px;\n  position: fixed;\n  bottom: 5px;\n  right: 5px;\n  z-index: 10001;\n']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mixinsDefault = require('./mixins/default');

var _mixinsDefault2 = _interopRequireDefault(_mixinsDefault);

var TestshotToggle = _styledComponents2['default'].a(_templateObject);

exports['default'] = (0, _mixinsDefault2['default'])(TestshotToggle);
module.exports = exports['default'];