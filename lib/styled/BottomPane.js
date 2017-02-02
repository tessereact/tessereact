'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n    background-color: #fafafa;\n    text-align: left;\n  '], ['\n    background-color: #fafafa;\n    text-align: left;\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    border-top: 1px solid #e6e6e6;\n    display: flex;\n  '], ['\n    border-top: 1px solid #e6e6e6;\n    display: flex;\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    width: 50%;\n    overflow: scroll;\n    padding: 20px;\n\n    &:nth-child(even) {\n      border-left: 1px solid #e6e6e6;\n    }\n  '], ['\n    width: 50%;\n    overflow: scroll;\n    padding: 20px;\n\n    &:nth-child(even) {\n      border-left: 1px solid #e6e6e6;\n    }\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    border-bottom: 1px solid #e6e6e6;\n    color: #4a4a4a;\n    font-size: 16px;\n    margin-bottom: 15px;\n    padding-bottom: 15px;\n  '], ['\n    border-bottom: 1px solid #e6e6e6;\n    color: #4a4a4a;\n    font-size: 16px;\n    margin-bottom: 15px;\n    padding-bottom: 15px;\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n  color: #4a4a4a;\n  line-height: 20px;\n  font-size: 13px;\n  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n'], ['\n  color: #4a4a4a;\n  line-height: 20px;\n  font-size: 13px;\n  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Pane = (0, _default2.default)(_styledComponents2.default.div(_templateObject));

Pane.Row = (0, _default2.default)(_styledComponents2.default.div(_templateObject2));

Pane.Column = (0, _default2.default)(_styledComponents2.default.div(_templateObject3));

Pane.ColumnHeader = (0, _default2.default)(_styledComponents2.default.h3(_templateObject4));

Pane.ColumnBody = _styledComponents2.default.pre(_templateObject5);

exports.default = Pane;