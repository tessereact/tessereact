'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  text-align: center;\n  font-size: 24.5px;\n  color: #34495e;\n  font-weight: bold;\n  margin-bottom: 15px;\n  margin-top: 5px;\n'], ['\n  text-align: center;\n  font-size: 24.5px;\n  color: #34495e;\n  font-weight: bold;\n  margin-bottom: 15px;\n  margin-top: 5px;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Header = _styledComponents2.default.div(_templateObject);

exports.default = (0, _default2.default)(Header);