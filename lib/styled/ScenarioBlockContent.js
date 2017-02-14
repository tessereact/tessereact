'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  border: 1px solid #f1f1f1;\n  margin: 10px 0;\n  padding: 10px;\n'], ['\n  border: 1px solid #f1f1f1;\n  margin: 10px 0;\n  padding: 10px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ScenarioBlockContent = _styledComponents2.default.div(_templateObject);

exports.default = ScenarioBlockContent;