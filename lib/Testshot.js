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
    })
  },

  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_TestshotWindow2.default, { host: this.props.server.host, port: this.props.server.port, data: data })
    );
  }
});

exports.default = Testshot;