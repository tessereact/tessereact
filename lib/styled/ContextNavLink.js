'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  ', '\n  color: ', ';\n  background: ', ';\n  overflow: hidden;\n  cursor: pointer;\n  text-decoration: none;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  margin-left: -20px;\n  margin-right: -10px;\n  border-radius: 0 3px 3px 0;\n  padding: 7px 20px;\n'], ['\n  ', '\n  color: ', ';\n  background: ', ';\n  overflow: hidden;\n  cursor: pointer;\n  text-decoration: none;\n  display: flex;\n  flex-wrap: nowrap;\n  align-items: center;\n  margin-left: -20px;\n  margin-right: -10px;\n  border-radius: 0 3px 3px 0;\n  padding: 7px 20px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

var _link = require('../lib/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContextNavLink = (0, _styledComponents2.default)(_link2.default)(_templateObject, _default2.default, function (props) {
  return props.active ? '#fefefe' : '#c7c7c7';
}, function (props) {
  return props.active ? '#278db5' : 'inherit';
});

exports.default = ContextNavLink;