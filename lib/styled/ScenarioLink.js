'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  color: ', ';\n  background: ', ';\n  display: block;\n  text-align: left;\n  cursor: pointer;\n  padding: 7px 20px;\n  margin-left: -10px;\n  margin-right: -10px;\n  padding-left: 30px;\n'], ['\n  color: ', ';\n  background: ', ';\n  display: block;\n  text-align: left;\n  cursor: pointer;\n  padding: 7px 20px;\n  margin-left: -10px;\n  margin-right: -10px;\n  padding-left: 30px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// TODO: Split it up into Button and built AcceptButton on top of it
var ScenarioLink = _styledComponents2.default.a(_templateObject, function (props) {
  return props.noDiff ? '#1abc9c' : '#e74c3c';
}, function (props) {
  return props.active && '#e6e6e6';
});

exports.default = (0, _default2.default)(ScenarioLink);