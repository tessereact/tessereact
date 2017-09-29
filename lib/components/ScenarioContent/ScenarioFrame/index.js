'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScenarioFrame = function (_React$Component) {
  _inherits(ScenarioFrame, _React$Component);

  function ScenarioFrame(props, componentContext) {
    _classCallCheck(this, ScenarioFrame);

    var _this = _possibleConstructorReturn(this, (ScenarioFrame.__proto__ || Object.getPrototypeOf(ScenarioFrame)).call(this, props, componentContext));

    var context = props.context,
        name = props.name;

    _this.url = '/contexts/' + context + '/scenarios/' + name + '/view';
    return _this;
  }

  _createClass(ScenarioFrame, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _props = this.props,
          context = _props.context,
          name = _props.name;

      this.iframe.contentWindow.postMessage({ context: context || 'null', scenario: name }, '*');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var className = this.props.className;


      return _react2.default.createElement('iframe', {
        src: this.url,
        className: className,
        ref: function ref(iframe) {
          _this2.iframe = iframe;
        }
      });
    }
  }]);

  return ScenarioFrame;
}(_react2.default.Component);

exports.default = ScenarioFrame;