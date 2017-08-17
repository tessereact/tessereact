'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 5px;\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-left: 4px solid;\n'], ['\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 5px;\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-left: 4px solid;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 5px;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n\n  border-top: 4px solid ;\n'], ['\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-right: 5px;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n\n  border-top: 4px solid ;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Arrow = {};
Arrow.Right = _styledComponents2.default.div(_templateObject);

Arrow.Down = _styledComponents2.default.div(_templateObject2);

exports.default = Arrow;