'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  position: relative;\n  flex-basis: 80%;\n  background: white;\n  max-height: 100vh;\n  overflow-y: auto;\n'], ['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  position: relative;\n  flex-basis: 80%;\n  background: white;\n  max-height: 100vh;\n  overflow-y: auto;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100vh;\n'], ['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100vh;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Content = _styledComponents2.default.div(_templateObject);

Content.Wrapper = _styledComponents2.default.div(_templateObject2);

exports.default = Content;