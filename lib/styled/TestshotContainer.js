'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  min-height: 100vh;\n  position: fixed;\n  width: 100%;\n  top: 0;\n  left: 0;\n  background: #f3f4f5;\n'], ['\n  display: flex;\n  min-height: 100vh;\n  position: fixed;\n  width: 100%;\n  top: 0;\n  left: 0;\n  background: #f3f4f5;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var TestshotContainer = _styledComponents2.default.div(_templateObject);

exports.default = TestshotContainer;