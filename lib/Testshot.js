'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scenario = scenario;
exports.context = context;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _TestshotWindow = require('./components/TestshotWindow');

var _TestshotWindow2 = _interopRequireDefault(_TestshotWindow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var names = [];
var data = [];
var currentContext = null;

function scenario(name, type) {
  var contextCopy = currentContext;
  if (names.indexOf([name, currentContext]) > -1) {
    throw new Error('Scenario with name "' + name + '" already exists');
  }
  names.push([name, currentContext]);

  data.push(function () {
    var scenarioElement = _react2.default.createElement(type, { key: name });
    return {
      name: name,
      element: scenarioElement,
      // TODO: Handle exception during rendering,
      // store and then display it
      snapshot: _server2.default.renderToStaticMarkup(scenarioElement),
      context: contextCopy
    };
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
    if (data.length) {
      return _react2.default.createElement(_TestshotWindow2.default, { host: this.props.server.host, port: this.props.server.port, data: data, routeData: this.props.routeData });
    } else {
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
            { href: 'https://github.com/toptal/testshot/blob/docs/docs/usage.md' },
            'here'
          ),
          '.'
        )
      );
    }
  }
});

exports.default = Testshot;