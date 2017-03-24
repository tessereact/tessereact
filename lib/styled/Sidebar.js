'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  flex-basis: 20%;\n  color: #e4e4e4;\n  text-align: left;\n  max-height: 100vh;\n  min-width: 200px;\n  flex-direction: column;\n'], ['\n  display: flex;\n  flex-basis: 20%;\n  color: #e4e4e4;\n  text-align: left;\n  max-height: 100vh;\n  min-width: 200px;\n  flex-direction: column;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: 70px;\n  font-size: 24px;\n  padding: 20px;\n  font-weight: normal;\n  border-bottom: 1px solid #4d5056;\n'], ['\n  height: 70px;\n  font-size: 24px;\n  padding: 20px;\n  font-weight: normal;\n  border-bottom: 1px solid #4d5056;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  padding: 20px;\n  border-bottom: 1px solid #4d5056;\n'], ['\n  padding: 20px;\n  border-bottom: 1px solid #4d5056;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  padding: 20px;\n  overflow-y: auto;\n'], ['\n  padding: 20px;\n  overflow-y: auto;\n']),
    _templateObject5 = _taggedTemplateLiteral(['\n  margin-bottom: 20px;\n'], ['\n  margin-bottom: 20px;\n']),
    _templateObject6 = _taggedTemplateLiteral(['\n  list-style: none;\n  font-size: 14px;\n'], ['\n  list-style: none;\n  font-size: 14px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Sidebar = _styledComponents2.default.div(_templateObject);

Sidebar.Header = (0, _default2.default)(_styledComponents2.default.div(_templateObject2));

Sidebar.SearchBox = (0, _default2.default)(_styledComponents2.default.div(_templateObject3));

Sidebar.List = (0, _default2.default)(_styledComponents2.default.div(_templateObject4));

Sidebar.Failed = (0, _default2.default)(_styledComponents2.default.div(_templateObject5));

Sidebar.ListItem = (0, _default2.default)(_styledComponents2.default.li(_templateObject6));

exports.default = (0, _default2.default)(Sidebar);