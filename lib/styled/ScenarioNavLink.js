'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  color: ', ';\n  overflow: hidden;\n  display: block;\n  text-align: left;\n  cursor: pointer;\n  padding: 7px 0px;\n  border-radius: 0 3px 3px 0;\n  margin-left: -20px;\n  margin-right: -10px;\n  padding-left: ', ';\n  text-decoration: none;\n\n  &.active {\n    color: #fff;\n    background: ', '\n  }\n'], ['\n  color: ', ';\n  overflow: hidden;\n  display: block;\n  text-align: left;\n  cursor: pointer;\n  padding: 7px 0px;\n  border-radius: 0 3px 3px 0;\n  margin-left: -20px;\n  margin-right: -10px;\n  padding-left: ', ';\n  text-decoration: none;\n\n  &.active {\n    color: #fff;\n    background: ', '\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ScenarioNavLink = (0, _styledComponents2.default)(_reactRouterDom.NavLink)(_templateObject, function (props) {
  return props.hasDiff ? '#e91e63' : '#939599';
}, function (props) {
  return props.child ? '40px' : '20px';
}, function (props) {
  return props.hasDiff ? '#e91e63' : '#278db5';
});

exports.default = (0, _default2.default)(ScenarioNavLink);