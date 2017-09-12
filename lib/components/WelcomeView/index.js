'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WelcomeView;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function WelcomeView() {
  // TODO: Replace with nice and stylish welcome page :)
  return _react2.default.createElement(
    'div',
    { style: { 'text-align': 'center' } },
    _react2.default.createElement(
      'h1',
      null,
      'Welcome to Tessereact'
    ),
    _react2.default.createElement(
      'p',
      null,
      'It\'s time to add your first scenario.'
    ),
    _react2.default.createElement(
      'p',
      null,
      'Don\'t know how? Have a look ',
      _react2.default.createElement(
        'a',
        { href: 'https://github.com/tessereact/tessereact/blob/master/docs/usage.md' },
        'here'
      ),
      '.'
    )
  );
}