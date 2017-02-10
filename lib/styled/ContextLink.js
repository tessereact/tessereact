'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background: ', ';\n  display: block;\n  cursor: pointer;\n  text-align: left;\n  padding: 7px 20px;\n  margin-left: -10px;\n  margin-right: -10px;\n  padding-left: 30px;\n'], ['\n  background: ', ';\n  display: block;\n  cursor: pointer;\n  text-align: left;\n  padding: 7px 20px;\n  margin-left: -10px;\n  margin-right: -10px;\n  padding-left: 30px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContextLink = _styledComponents2.default.a(_templateObject, function (props) {
  return props.active && '#e6e6e6';
});

exports.default = (0, _default2.default)(ContextLink);