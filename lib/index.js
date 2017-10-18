'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // Main entry point, exposes the public API

exports.scenario = scenario;
exports.context = context;
exports.init = init;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _WelcomeView = require('./components/WelcomeView');

var _WelcomeView2 = _interopRequireDefault(_WelcomeView);

var _MainView = require('./components/MainView');

var _MainView2 = _interopRequireDefault(_MainView);

var _ScenarioView = require('./components/ScenarioView');

var _ScenarioView2 = _interopRequireDefault(_ScenarioView);

var _FetchCSSView = require('./components/FetchCSSView');

var _FetchCSSView2 = _interopRequireDefault(_FetchCSSView);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

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

var UI = exports.UI = function (_React$Component) {
  _inherits(UI, _React$Component);

  function UI() {
    _classCallCheck(this, UI);

    return _possibleConstructorReturn(this, (UI.__proto__ || Object.getPrototypeOf(UI)).apply(this, arguments));
  }

  _createClass(UI, [{
    key: 'render',
    value: function render() {
      if (!data.length) {
        return _react2.default.createElement(_WelcomeView2.default);
      }

      if (this.props.routeData.route.name === 'view') {
        return _react2.default.createElement(_ScenarioView2.default, {
          data: data,
          routeData: this.props.routeData
        });
      }

      if (this.props.routeData.route.name === 'fetchCSS') {
        return _react2.default.createElement(_FetchCSSView2.default, { data: data });
      }

      return _react2.default.createElement(_MainView2.default, {
        host: this.props.server.host,
        port: this.props.server.port,
        data: data,
        routeData: this.props.routeData
      });
    }
  }]);

  return UI;
}(_react2.default.Component);

if (PropTypes) {
  UI.propTypes = {
    server: PropTypes.shape({
      host: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired
    }),
    routeData: PropTypes.object.isRequired
  };
}

/**
 * Run Tessereact UI.
 * @param {Object} [userOptions]
 * @param {String} [userOptions.className] - CSS class of Tessereact UI wrapper elemtn
 */
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
    _reactDom2.default.render(_react2.default.createElement(UI, Object.assign({}, options, { routeData: routeData })), wrapperElement);
  });
}