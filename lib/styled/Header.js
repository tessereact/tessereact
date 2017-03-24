'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: fixed;\n  display: flex;\n  align-items: center;\n  width: 80%;\n  font-size: 24px;\n  color: ', ';\n  text-align: left;\n  font-weight: normal;\n  height: 70px;\n  padding: 20px;\n  background: #f5f6f8;\n  border: 1px solid #e2e2e2;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);\n  z-index: 1;\n'], ['\n  position: fixed;\n  display: flex;\n  align-items: center;\n  width: 80%;\n  font-size: 24px;\n  color: ', ';\n  text-align: left;\n  font-weight: normal;\n  height: 70px;\n  padding: 20px;\n  background: #f5f6f8;\n  border: 1px solid #e2e2e2;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);\n  z-index: 1;\n']);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _default = require('./mixins/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Header = _styledComponents2.default.div(_templateObject, function (props) {
  return props.color;
});

exports.default = (0, _default2.default)(Header);