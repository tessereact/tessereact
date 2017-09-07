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

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init() {
  var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({
    server: {
      host: 'localhost',
      port: window.__tessereactServerPort ? String(window.__tessereactServerPort) : '5001'
    }
  }, userOptions);
  var wrapperElement = document.createElement('div');

  if (userOptions.className) {
    wrapperElement.classList.add(userOptions.className);
  }
  document.body.appendChild(wrapperElement);

  _routes2.default.start(function (routeData) {
    _reactDom2.default.render(_react2.default.createElement(_Testshot2.default, Object.assign({}, options, { routeData: routeData })), wrapperElement);
  });
}