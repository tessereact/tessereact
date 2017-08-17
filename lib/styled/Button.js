'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background-color: #bcbcbc;\n  color: #fff;\n  padding: 10px 15px;\n  font-size: 13px;\n  border-radius: 4px;\n  border: 0;\n  line-height: 1.4;\n  cursor: pointer;\n  text-transform: uppercase;\n  margin-left: 10px;\n'], ['\n  background-color: #bcbcbc;\n  color: #fff;\n  padding: 10px 15px;\n  font-size: 13px;\n  border-radius: 4px;\n  border: 0;\n  line-height: 1.4;\n  cursor: pointer;\n  text-transform: uppercase;\n  margin-left: 10px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = _styledComponents2.default.button(_templateObject);

exports.default = (0, _default2.default)(Button);