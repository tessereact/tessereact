'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  width: 100%;\n  height: 100%;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n  overflow-x: hidden;\n\n'], ['\n  width: 100%;\n  height: 100%;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n  overflow-x: hidden;\n\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n  width: 100%;\n'], ['\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n  width: 100%;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  border-left: 2px solid #d8d8d8;'], ['\n  border-left: 2px solid #d8d8d8;']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ComponentPreview = _styledComponents2.default.div(_templateObject);

ComponentPreview.LeftPane = _styledComponents2.default.div(_templateObject2);

ComponentPreview.RightPane = (0, _styledComponents2.default)(ComponentPreview.LeftPane)(_templateObject3);

exports.default = ComponentPreview;