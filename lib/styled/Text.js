'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 500;\n'], ['\n  color: ', ';\n  font-size: ', ';\n  font-weight: 500;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Text = _styledComponents2.default.span(_templateObject, function (props) {
  return props.color;
}, function (props) {
  return props.fontSize;
});

exports.default = (0, _default2.default)(Text);