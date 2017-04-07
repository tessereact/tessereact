'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  color: #c7c7c7;\n  overflow: hidden;\n  text-decoration: none;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  margin-left: -20px;\n  margin-right: -10px;\n  border-radius: 0 3px 3px 0;\n  padding: 7px 20px;\n\n  &.active {\n    background: #278db5;\n    color: #fefefe;\n  }\n'], ['\n  color: #c7c7c7;\n  overflow: hidden;\n  text-decoration: none;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  margin-left: -20px;\n  margin-right: -10px;\n  border-radius: 0 3px 3px 0;\n  padding: 7px 20px;\n\n  &.active {\n    background: #278db5;\n    color: #fefefe;\n  }\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContextNavLink = (0, _styledComponents2.default)(_reactRouterDom.NavLink)(_templateObject);

exports.default = (0, _default2.default)(ContextNavLink);