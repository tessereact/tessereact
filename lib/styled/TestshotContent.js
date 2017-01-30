'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: relative;\n  flex-basis: 60%;\n  padding: 10px;\n  background: white;\n  max-height: 100vh;\n  overflow-y: auto;\n'], ['\n  position: relative;\n  flex-basis: 60%;\n  padding: 10px;\n  background: white;\n  max-height: 100vh;\n  overflow-y: auto;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TestshotContent = _styledComponents2.default.div(_templateObject);

exports.default = (0, _default2.default)(TestshotContent);