'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  color: ', ';\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n\n  &:hover {\n    text-decoration: underline;\n  }\n'], ['\n  color: ', ';\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n\n  &:hover {\n    text-decoration: underline;\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ScenarioBlockHeader = _styledComponents2.default.a(_templateObject, function (props) {
  return props.hasDiff ? '#e91e63 !important' : '#8f9297';
});

exports.default = (0, _default2.default)(ScenarioBlockHeader);