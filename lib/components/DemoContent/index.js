'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Header = require('../../styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Content = require('../../styled/Content');

var _Content2 = _interopRequireDefault(_Content);

var _ComponentPreview = require('../../styled/ComponentPreview');

var _ComponentPreview2 = _interopRequireDefault(_ComponentPreview);

var _routes = require('../_lib/routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * UI element which shows demo page to the user.
 * @extends React.Component
 */
var DemoContent = function (_React$Component) {
  _inherits(DemoContent, _React$Component);

  function DemoContent() {
    _classCallCheck(this, DemoContent);

    return _possibleConstructorReturn(this, (DemoContent.__proto__ || Object.getPrototypeOf(DemoContent)).apply(this, arguments));
  }

  _createClass(DemoContent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (!window.__tessereactDemoMode) {
        (0, _routes.redirectToHome)();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Content2.default.Wrapper,
        null,
        _react2.default.createElement(
          _Header2.default,
          null,
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'span',
              null,
              window.__tessereactDemoMode.title
            )
          )
        ),
        _react2.default.createElement(
          _ComponentPreview2.default,
          null,
          window.__tessereactDemoMode.description
        )
      );
    }
  }]);

  return DemoContent;
}(_react2.default.Component);

exports.default = DemoContent;