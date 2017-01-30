'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  flex-basis: ', ';\n  padding: 10px;\n  color: #333;\n  text-align: left;\n  max-height: 100vh;\n  overflow-y: auto;\n'], ['\n  flex-basis: ', ';\n  padding: 10px;\n  color: #333;\n  text-align: left;\n  max-height: 100vh;\n  overflow-y: auto;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Sidebar = _styledComponents2.default.div(_templateObject, function (props) {
  return props.right ? '35%' : '15%';
});

exports.default = (0, _default2.default)(Sidebar);