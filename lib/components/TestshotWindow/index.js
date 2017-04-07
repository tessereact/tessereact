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

var _reactRouterDom = require('react-router-dom');

var _reactRouter = require('react-router');

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
    port: _react.PropTypes.string.isRequired
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
  render: function render() {
    var _this2 = this;

    return _react2.default.createElement(
      _reactRouterDom.BrowserRouter,
      null,
      _react2.default.createElement(
        _TestshotContainer2.default,
        null,
        _react2.default.createElement(_Navigation2.default, {
          failedScenariosCount: this.state.scenarios.filter(function (c) {
            return c.hasDiff;
          }).length,
          scenariosCount: this.state.scenarios.length,
          nodes: (0, _helpers.generateTreeNodes)(this.state.scenarios)
        }),
        this.state.scenarios[0].hasOwnProperty('hasDiff') && _react2.default.createElement(
          _TestshotContent2.default,
          null,
          _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/', render: function render(_) {
              var scenario = (0, _find3.default)(_this2.state.scenarios, function (s) {
                return s.hasDiff;
              }) || _this2.state.scenarios[0];
              return _react2.default.createElement(_reactRouter.Redirect, { to: '/contexts/' + scenario.context + '/scenarios/' + scenario.name });
            } }),
          _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: '/contexts/:context', render: function render(_ref3) {
              var match = _ref3.match;

              return _this2._renderContext(match.params.context);
            } }),
          _react2.default.createElement(_reactRouterDom.Route, { path: '/contexts/:context/scenarios/:scenario', render: function render(routerContext) {
              var match = routerContext.match,
                  history = routerContext.history;

              return _this2._renderScenario(history, match.params.context, match.params.scenario);
            } })
        )
      )
    );
  },
  _renderScenario: function _renderScenario(history, contextName, scenarioName) {
    var _this3 = this;

    var scenario = (0, _find3.default)(this.state.scenarios, function (s) {
      if (contextName !== 'null') {
        return s.name === scenarioName && s.context === contextName;
      } else {
        return s.name === scenarioName && !s.context;
      }
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
          scenario.name
        ),
        scenario.hasDiff && _react2.default.createElement(
          _AcceptButton2.default,
          { onClick: function onClick(_) {
              return _this3._acceptSnapshot(scenario, history);
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
    var _this4 = this;

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
            _this4._renderSectionHeader(s),
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
    var _this5 = this;

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
          _this5._renderSectionHeader(s),
          _react2.default.createElement(
            _ScenarioBlockContent2.default,
            { key: s.name },
            s.element
          )
        );
      });
    }
  },
  _acceptSnapshot: function _acceptSnapshot(scenario, history) {
    var _this6 = this;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots';
    (0, _fetch.postJSON)(url, (0, _helpers.requestScenarioAcceptance)(scenario)).then(function (_) {
      _this6.setState((0, _helpers.acceptCurrentScenario)(_this6.state, scenario));
      history.push('/');
    });
  },
  _renderDiff: function _renderDiff(scenario) {
    if (scenario.hasDiff) {
      return this._computeDiff(scenario);
    }
  },
  _computeDiff: function _computeDiff(scenario) {
    var previousSnapshot = scenario.previousSnapshot;
    var snapshot = scenario.snapshot;
    if (!snapshot.length) {
      return null;
    }
    var diff = htmlDiffer.diffHtml(previousSnapshot, snapshot);
    return _react2.default.createElement(_Diff2.default, { nodes: diff });
  }
});

exports.default = TestshotWindow;