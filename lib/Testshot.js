'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.scenario = scenario;
exports.context = context;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _TestshotWindow = require('./components/TestshotWindow');

var _TestshotWindow2 = _interopRequireDefault(_TestshotWindow);

var _ScenarioView = require('./components/ScenarioView');

var _ScenarioView2 = _interopRequireDefault(_ScenarioView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {
  // Ignore optional peer dependency
}

var names = [];
var data = [];
var currentContext = null;

/**
 * Create a scenario.
 * @param {String} name - name of the scenario
 * @param {React.Component} type - component to create a scenario from
 * @param {Object} [options]
 * @param {Boolean} [options.css] - enable CSS diff
 * @param {Boolean} [options.screenshot] - enable CSS and screenshot diff.
 *   When true, ignore the value of `options.css`
 */
function scenario(name, type) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      css = _ref.css,
      screenshot = _ref.screenshot;

  var contextCopy = currentContext;
  if (names.some(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        existingName = _ref3[0],
        existingContext = _ref3[1];

    return name === existingName && currentContext === existingContext;
  })) {
    throw new Error('Scenario with name "' + name + '" already exists');
  }
  names.push([name, currentContext]);

  data.push({
    name: name,
    getElement: function getElement() {
      return _react2.default.createElement(type, { key: name });
    },
    // TODO: Handle exception during rendering,
    // store and then display it
    getSnapshot: function getSnapshot() {
      return _server2.default.renderToStaticMarkup(_react2.default.createElement(type, { key: name }));
    },
    context: contextCopy,
    options: {
      css: css || screenshot,
      screenshot: screenshot
    }
  });
}

/**
 * Recieves the name of context and a function.
 * Any scenarios created inside the function would have that context.
 * @param {String} contextName
 * @param {Function} func
 */
function context(contextName, func) {
  currentContext = contextName;
  func();
  currentContext = null;
}

/**
 * UI of Tessereact.
 * @extends React.Component
 * @property {String} props.host - host of the Tessereact server
 * @property {String} props.port - port of the Tessereact server
 * @property {RouteData} props.routeData
 */

var Testshot = function (_React$Component) {
  _inherits(Testshot, _React$Component);

  function Testshot() {
    _classCallCheck(this, Testshot);

    return _possibleConstructorReturn(this, (Testshot.__proto__ || Object.getPrototypeOf(Testshot)).apply(this, arguments));
  }

  _createClass(Testshot, [{
    key: 'render',
    value: function render() {
      if (!data.length) {
        // TODO: Replace with nice and stylish welcome page :)
        return _react2.default.createElement(
          'div',
          { style: { 'text-align': 'center' } },
          _react2.default.createElement(
            'h1',
            null,
            'Welcome to Testshot'
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
              { href: 'https://github.com/toptal/testshot/blob/master/docs/usage.md' },
              'here'
            ),
            '.'
          )
        );
      }

      if (this.props.routeData.route.name === 'view') {
        return _react2.default.createElement(_ScenarioView2.default, { data: data, routeData: this.props.routeData });
      }

      return _react2.default.createElement(_TestshotWindow2.default, { host: this.props.server.host, port: this.props.server.port, data: data, routeData: this.props.routeData });
    }
  }]);

  return Testshot;
}(_react2.default.Component);

if (PropTypes) {
  Testshot.propTypes = {
    server: PropTypes.shape({
      host: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired
    }),
    routeData: PropTypes.object.isRequired
  };
}

exports.default = Testshot;