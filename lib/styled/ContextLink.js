'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background: ', ';\n  color: ', ';\n  overflow: hidden;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  cursor: pointer;\n  text-align: left;\n  padding: 7px 20px;\n  margin-left: -20px;\n  margin-right: -10px;\n  padding-left: 20px;\n  border-radius: 0 3px 3px 0;\n'], ['\n  background: ', ';\n  color: ', ';\n  overflow: hidden;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  cursor: pointer;\n  text-align: left;\n  padding: 7px 20px;\n  margin-left: -20px;\n  margin-right: -10px;\n  padding-left: 20px;\n  border-radius: 0 3px 3px 0;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContextLink = _styledComponents2.default.span(_templateObject, function (props) {
  return props.active && '#278db5';
}, function (props) {
  return props.active ? '#fefefe' : '#c7c7c7';
});

exports.default = (0, _default2.default)(ContextLink);