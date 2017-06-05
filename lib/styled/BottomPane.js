'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n    background-color: #f5f6f8;\n    text-align: left;\n    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.15);\n  '], ['\n    background-color: #f5f6f8;\n    text-align: left;\n    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.15);\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n    border-top: 1px solid #e2e2e2;\n    display: flex;\n    padding: 20px;\n  '], ['\n    border-top: 1px solid #e2e2e2;\n    display: flex;\n    padding: 20px;\n  ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    border-top: 1px solid #e2e2e2;\n    display: flex;\n  '], ['\n    border-top: 1px solid #e2e2e2;\n    display: flex;\n  ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    width: 50%;\n    overflow: scroll;\n    padding: 10px;\n\n    &:nth-child(even) {\n      border-left: 1px solid #e2e2e2;\n    }\n  '], ['\n    width: 50%;\n    overflow: scroll;\n    padding: 10px;\n\n    &:nth-child(even) {\n      border-left: 1px solid #e2e2e2;\n    }\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    border-bottom: 1px solid #e2e2e2;\n    color: #32363d;\n    font-weight: normal;\n    font-size: 14px;\n    margin: 0;\n    padding-bottom: 10px;\n  '], ['\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    border-bottom: 1px solid #e2e2e2;\n    color: #32363d;\n    font-weight: normal;\n    font-size: 14px;\n    margin: 0;\n    padding-bottom: 10px;\n  ']),
    _templateObject6 = _taggedTemplateLiteral(['\n  color: #32363d;\n  line-height: 20px;\n  font-size: 13px;\n  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n'], ['\n  color: #32363d;\n  line-height: 20px;\n  font-size: 13px;\n  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;\n  word-wrap: break-word;\n  white-space: pre-wrap;\n']),
    _templateObject7 = _taggedTemplateLiteral(['\n  background: #278db5;\n  float: right;\n  cursor: pointer;\n  border-radius: 3px;\n  color: #fff;\n  font-size: 12px;\n  padding: 3px;\n'], ['\n  background: #278db5;\n  float: right;\n  cursor: pointer;\n  border-radius: 3px;\n  color: #fff;\n  font-size: 12px;\n  padding: 3px;\n']),
    _templateObject8 = _taggedTemplateLiteral(['\n  padding: 3px;\n'], ['\n  padding: 3px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Pane = (0, _default2.default)(_styledComponents2.default.div(_templateObject));

Pane.Buttons = (0, _default2.default)(_styledComponents2.default.div(_templateObject2));

Pane.Row = (0, _default2.default)(_styledComponents2.default.div(_templateObject3));

Pane.Column = (0, _default2.default)(_styledComponents2.default.div(_templateObject4));

Pane.ColumnHeader = (0, _default2.default)(_styledComponents2.default.h3(_templateObject5));

Pane.ColumnBody = _styledComponents2.default.pre(_templateObject6);

Pane.CollapseButton = _styledComponents2.default.a(_templateObject7);

Pane.Text = _styledComponents2.default.span(_templateObject8);

exports.default = Pane;