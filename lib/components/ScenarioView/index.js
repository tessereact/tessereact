'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScenarioView = _react2.default.createClass({
  displayName: 'ScenarioView',

  propTypes: {
    data: _react.PropTypes.array.isRequired,
    routeData: _react.PropTypes.object
  },

  getInitialState: function getInitialState() {
    return {
      element: null
    };
  },
  componentWillMount: function componentWillMount() {
    var _props$routeData$para = this.props.routeData.params,
        contextName = _props$routeData$para.context,
        name = _props$routeData$para.scenario;

    var scenarios = this.props.data;
    var context = contextName === 'null' ? null : contextName;
    var scenario = (0, _find3.default)(scenarios, { name: name, context: context });
    this.setState({
      element: scenario.getElement()
    });
  },
  render: function render() {
    var element = this.state.element;

    return element;
  }
});

exports.default = ScenarioView;