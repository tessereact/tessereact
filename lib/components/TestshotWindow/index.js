'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _htmlDiffer = require('html-differ');

var _Diff = require('../../components/Diff');

var _Diff2 = _interopRequireDefault(_Diff);

var _Navigation = require('../../components/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _fetch = require('../../lib/fetch');

var _helpers = require('./helpers');

var _history = require('../../lib/router/history');

var _history2 = _interopRequireDefault(_history);

var _TestshotContainer = require('../../styled/TestshotContainer');

var _TestshotContainer2 = _interopRequireDefault(_TestshotContainer);

var _Header = require('../../styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _TestshotContent = require('../../styled/TestshotContent');

var _TestshotContent2 = _interopRequireDefault(_TestshotContent);

var _ComponentPreview = require('../../styled/ComponentPreview');

var _ComponentPreview2 = _interopRequireDefault(_ComponentPreview);

var _ScenarioBlock = require('../../styled/ScenarioBlock');

var _ScenarioBlock2 = _interopRequireDefault(_ScenarioBlock);

var _ScenarioBlockContent = require('../../styled/ScenarioBlockContent');

var _ScenarioBlockContent2 = _interopRequireDefault(_ScenarioBlockContent);

var _AcceptButton = require('../../styled/AcceptButton');

var _AcceptButton2 = _interopRequireDefault(_AcceptButton);

var _Text = require('../../styled/Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// styled components
var htmlDiffer = new _htmlDiffer.HtmlDiffer({
  ignoreWhitespaces: false
});

var TestshotWindow = _react2.default.createClass({
  displayName: 'TestshotWindow',

  propTypes: {
    data: _react.PropTypes.array.isRequired,
    host: _react.PropTypes.string.isRequired,
    port: _react.PropTypes.string.isRequired,
    routeData: _react.PropTypes.object
  },

  getInitialState: function getInitialState() {
    return (0, _helpers.buildInitialState)(this.props.data);
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots-list';
    (0, _fetch.postJSON)(url, (0, _helpers.requestScenariosList)(this.state.scenarios)).then(function (response) {
      response.json().then(function (json) {
        _this.setState((0, _helpers.mergeWithPayload)(_this.state, json));
        _this._checkForHomeRoute(_this.props);
        _this._checkIfRouteExists(_this.props);

        // Report to CI
        var failingScenarios = _this.state.scenarios.filter(function (_ref) {
          var hasDiff = _ref.hasDiff;
          return hasDiff;
        }).map(function (_ref2) {
          var context = _ref2.context,
              name = _ref2.name;
          return { context: context, name: name };
        });

        var ws = new window.WebSocket(window.__testshotWSURL);
        ws.addEventListener('open', function () {
          if (failingScenarios.length > 0) {
            ws.send(JSON.stringify(failingScenarios));
          } else {
            ws.send('OK');
          }
        });
      });
    }, function (_) {
      window.alert('Snapshot server is not available!');
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this._checkForHomeRoute(nextProps);
  },
  _checkIfRouteExists: function _checkIfRouteExists(props) {
    var _getRouteData = this.getRouteData(props),
        context = _getRouteData.context,
        scenario = _getRouteData.scenario,
        routeName = _getRouteData.routeName;

    switch (routeName) {
      case 'scenario':
        !this._findScenario(context, scenario) && _history2.default.push('/contexts/' + context);
        break;
      case 'context':
        !this.state.scenarios.find(function (s) {
          return s.context === context;
        }) && _history2.default.push('/');
        break;
      case 'home':
        break;
      default:
        _history2.default.push('/');
    }
  },
  _checkForHomeRoute: function _checkForHomeRoute(props) {
    var routeName = props.routeData.route.name;
    var scenarios = this.state.scenarios;


    if (routeName === 'home') {
      var scenario = (0, _find3.default)(scenarios, function (s) {
        return s.hasDiff;
      }) || scenarios[0];
      _history2.default.push('/contexts/' + scenario.context + '/scenarios/' + scenario.name);
    }
  },
  _areScenariosAvailable: function _areScenariosAvailable() {
    return this.state.scenarios[0].hasOwnProperty('hasDiff');
  },
  getRouteData: function getRouteData(props) {
    var _props$routeData = props.routeData,
        _props$routeData$para = _props$routeData.params,
        context = _props$routeData$para.context,
        scenario = _props$routeData$para.scenario,
        routeName = _props$routeData.route.name;

    return { context: context, scenario: scenario, routeName: routeName };
  },
  render: function render() {
    var _getRouteData2 = this.getRouteData(this.props),
        context = _getRouteData2.context,
        scenario = _getRouteData2.scenario,
        routeName = _getRouteData2.routeName;

    var scenarios = this.state.scenarios;


    return _react2.default.createElement(
      _TestshotContainer2.default,
      null,
      _react2.default.createElement(_Navigation2.default, {
        failedScenariosCount: scenarios.filter(function (c) {
          return c.hasDiff;
        }).length,
        scenariosCount: scenarios.length,
        nodes: (0, _helpers.generateTreeNodes)(scenarios)
      }),
      this._areScenariosAvailable && _react2.default.createElement(
        _TestshotContent2.default,
        null,
        routeName === 'context' && this._renderContext(context),
        routeName === 'scenario' && this._renderScenario(this._findScenario(context, scenario))
      )
    );
  },
  _findScenario: function _findScenario(contextName, scenarioName) {
    return (0, _find3.default)(this.state.scenarios, function (s) {
      if (contextName !== 'null') {
        return s.name === scenarioName && s.context === contextName;
      } else {
        return s.name === scenarioName && !s.context;
      }
    });
  },
  _renderScenario: function _renderScenario(scenario) {
    var _this2 = this;

    if (!scenario) return null;
    return _react2.default.createElement(
      _TestshotContent2.default.Wrapper,
      null,
      _react2.default.createElement(
        _Header2.default,
        null,
        _react2.default.createElement(
          'span',
          null,
          scenario.name
        ),
        scenario.hasDiff && _react2.default.createElement(
          _AcceptButton2.default,
          { onClick: function onClick(_) {
              return _this2._acceptSnapshot(scenario);
            } },
          'Accept & next'
        )
      ),
      _react2.default.createElement(
        _ComponentPreview2.default,
        null,
        scenario.element
      ),
      this._renderDiff(scenario)
    );
  },
  _renderContext: function _renderContext(contextName) {
    var _this3 = this;

    var scenarios = this.state.scenarios.filter(function (s) {
      return s.context === contextName;
    });

    return _react2.default.createElement(
      _TestshotContent2.default.Wrapper,
      null,
      _react2.default.createElement(
        _Header2.default,
        null,
        _react2.default.createElement(
          'span',
          null,
          contextName
        )
      ),
      _react2.default.createElement(
        _ComponentPreview2.default,
        null,
        scenarios.map(function (s) {
          return _react2.default.createElement(
            _ScenarioBlock2.default,
            { key: s.name },
            _this3._renderSectionHeader(s),
            _react2.default.createElement(
              _ScenarioBlockContent2.default,
              { key: s.name },
              s.element
            )
          );
        })
      )
    );
  },
  _renderSectionHeader: function _renderSectionHeader(s) {
    return s.hasDiff ? _react2.default.createElement(
      _Text2.default,
      { color: '#e91e63', fontSize: '14px' },
      s.name
    ) : _react2.default.createElement(
      _Text2.default,
      { color: '#8f9297', fontSize: '14px' },
      s.name
    );
  },
  _renderContent: function _renderContent(node) {
    var _this4 = this;

    if (node.isScenario) {
      return node.element;
    } else {
      var scenarios = this.state.scenarios.filter(function (s) {
        return s.context === node.name;
      });
      return scenarios.map(function (s) {
        return _react2.default.createElement(
          _ScenarioBlock2.default,
          null,
          _this4._renderSectionHeader(s),
          _react2.default.createElement(
            _ScenarioBlockContent2.default,
            { key: s.name },
            s.element
          )
        );
      });
    }
  },
  _acceptSnapshot: function _acceptSnapshot(scenario) {
    var _this5 = this;

    var _props = this.props,
        host = _props.host,
        port = _props.port;

    var url = '//' + host + ':' + port + '/snapshots';

    (0, _fetch.postJSON)(url, (0, _helpers.requestScenarioAcceptance)(scenario)).then(function (_) {
      _this5.setState((0, _helpers.acceptCurrentScenario)(_this5.state, scenario));
      _history2.default.push('/');
    });
  },
  _renderDiff: function _renderDiff(scenario) {
    if (scenario.hasDiff) {
      return this._computeDiff(scenario);
    }
  },
  _computeDiff: function _computeDiff(scenario) {
    var previousSnapshot = scenario.previousSnapshot,
        snapshot = scenario.snapshot;


    if (!snapshot.length) {
      return null;
    }
    var diff = htmlDiffer.diffHtml(previousSnapshot, snapshot);
    return _react2.default.createElement(_Diff2.default, { nodes: diff });
  }
});

exports.default = TestshotWindow;