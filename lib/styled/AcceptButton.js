'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  background-color: #1abc9c;\n'], ['\n  background-color: #1abc9c;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AcceptButton = (0, _styledComponents2.default)(_Button2.default)(_templateObject);

exports.default = AcceptButton;