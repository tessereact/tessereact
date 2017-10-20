'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {}
// Ignore optional peer dependency


/**
 * Component which renders a single scenario in isolation mode.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 * @property {RouteData} props.routeData
 */

var ScenarioView = function (_React$Component) {
  _inherits(ScenarioView, _React$Component);

  function ScenarioView() {
    _classCallCheck(this, ScenarioView);

    return _possibleConstructorReturn(this, (ScenarioView.__proto__ || Object.getPrototypeOf(ScenarioView)).apply(this, arguments));
  }

  _createClass(ScenarioView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      window.addEventListener('message', function (event) {
        _routes2.default.navigateToRoute('view', event.data);
      }, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('message');
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$routeData$para = this.props.routeData.params,
          contextName = _props$routeData$para.context,
          name = _props$routeData$para.scenario;

      var scenarios = this.props.data;
      var context = contextName === 'null' ? null : contextName;
      var scenario = (0, _find3.default)(scenarios, { name: name, context: context });

      if (!scenario) {
        return _react2.default.createElement(
          'div',
          null,
          'This scenario does not exist.'
        );
      }

      var element = scenario.getElement();
      return element;
    }
  }]);

  return ScenarioView;
}(_react2.default.Component);

if (PropTypes) {
  ScenarioView.propTypes = {
    data: PropTypes.array.isRequired,
    routeData: PropTypes.object.isRequired
  };
}

exports.default = ScenarioView;