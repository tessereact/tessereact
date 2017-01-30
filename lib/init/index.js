'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Testshot = require('../Testshot');

var _Testshot2 = _interopRequireDefault(_Testshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({
    server: {
      host: 'localhost',
      port: '5001'
    }
  }, userOptions);

  var wrapperElement = document.createElement('div');
  if (options.className) {
    wrapperElement.classList.add(options.className);
  }
  document.body.appendChild(wrapperElement);

  _reactDom2.default.render(_react2.default.createElement(_Testshot2.default, options), wrapperElement);
}