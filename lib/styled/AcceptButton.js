'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  background-color: #1abc9c;\n  color: #fff;\n  padding: 10px 15px;\n  font-size: 13px;\n  border-radius: 4px;\n  border: 0;\n  line-height: 1.4;\n  cursor: pointer;\n'], ['\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  background-color: #1abc9c;\n  color: #fff;\n  padding: 10px 15px;\n  font-size: 13px;\n  border-radius: 4px;\n  border: 0;\n  line-height: 1.4;\n  cursor: pointer;\n']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mixinsDefault = require('./mixins/default');

var _mixinsDefault2 = _interopRequireDefault(_mixinsDefault);

// TODO: Split it up into Button and built AcceptButton on top of it
var AcceptButton = _styledComponents2['default'].button(_templateObject);

exports['default'] = (0, _mixinsDefault2['default'])(AcceptButton);
module.exports = exports['default'];