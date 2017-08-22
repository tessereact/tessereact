'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var names = [];
var data = [];
var currentContext = null;

function scenario(name, type) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var contextCopy = currentContext;
  if (names.some(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        existingName = _ref2[0],
        existingContext = _ref2[1];

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
    diffCSS: Boolean(options.diffCSS)
  });
}

function context(contextName, func) {
  currentContext = contextName;
  func();
  currentContext = null;
}

var Testshot = _react2.default.createClass({
  displayName: 'Testshot',

  propTypes: {
    data: _react.PropTypes.array,
    server: _react.PropTypes.shape({
      host: _react.PropTypes.string,
      port: _react.PropTypes.string
    }),
    routeData: _react.PropTypes.object
  },

  render: function render() {
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
});

exports.default = Testshot;