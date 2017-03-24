'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: 14px;\n  width: 100%;\n  height: 20px;\n  padding-left: 10px;\n  line-height: 1.2;\n  color: #e4e4e4;\n  border-radius: 5px;\n  border: none;\n  height: 36px;\n  background: #52555c;\n'], ['\n  font-size: 14px;\n  width: 100%;\n  height: 20px;\n  padding-left: 10px;\n  line-height: 1.2;\n  color: #e4e4e4;\n  border-radius: 5px;\n  border: none;\n  height: 36px;\n  background: #52555c;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var FilterInput = _styledComponents2.default.input(_templateObject);

exports.default = (0, _default2.default)(FilterInput);