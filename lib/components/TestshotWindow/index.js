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
        _this.setState((0, _helpers.pickFailingScenario)((0, _helpers.mergeWithPayload)(_this.state, json)));

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
    return _react2.default.createElement(
      _TestshotContainer2.default,
      null,
      _react2.default.createElement(_Navigation2.default, {
        failedScenariosCount: this.state.scenarios.filter(function (c) {
          return c.hasDiff;
        }).length,
        scenariosCount: this.state.scenarios.length,
        nodes: (0, _helpers.generateTreeNodes)(this.state.scenarios),
        selectedNode: this.state.selectedNode,
        selectNode: this._handleSelect
      }),
      _react2.default.createElement(
        _TestshotContent2.default,
        null,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            _Header2.default,
            { color: '#32363d' },
            _react2.default.createElement(
              'span',
              null,
              this.state.selectedNode.name
            ),
            this.state.selectedNode.hasDiff && _react2.default.createElement(
              _AcceptButton2.default,
              { onClick: this._acceptSnapshot },
              'Accept & next'
            )
          ),
          _react2.default.createElement(
            _ComponentPreview2.default,
            null,
            this._renderContent()
          )
        ),
        this._renderDiff()
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
  _renderContent: function _renderContent() {
    var _this2 = this;

    if (this.state.selectedNode.isScenario) {
      return this.state.selectedNode.element;
    } else {
      var scenarios = this.state.scenarios.filter(function (s) {
        return s.context === _this2.state.selectedNode.name;
      });
      return scenarios.map(function (s) {
        return _react2.default.createElement(
          _ScenarioBlock2.default,
          null,
          _this2._renderSectionHeader(s),
          _react2.default.createElement(
            _ScenarioBlockContent2.default,
            { key: s.name },
            s.element
          )
        );
      });
    }
  },
  _acceptSnapshot: function _acceptSnapshot() {
    var _this3 = this;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots';
    (0, _fetch.postJSON)(url, (0, _helpers.requestScenarioAcceptance)(this.state.selectedNode)).then(function () {
      _this3.setState((0, _helpers.pickFailingScenario)((0, _helpers.acceptCurrentScenario)(_this3.state)));
    });
  },
  _renderDiff: function _renderDiff() {
    if (this.state.selectedNode.hasDiff) {
      return this._computeDiff();
    }
  },
  _computeDiff: function _computeDiff() {
    var previousSnapshot = this.state.selectedNode.previousSnapshot;
    var snapshot = this.state.selectedNode.snapshot;
    var diff = htmlDiffer.diffHtml(previousSnapshot, snapshot);
    return _react2.default.createElement(_Diff2.default, { nodes: diff });
  },
  _handleSelect: function _handleSelect(context, scenario) {
    if (scenario) {
      this.setState({ selectedNode: (0, _find3.default)(this.state.scenarios, { name: scenario, context: context }) });
    } else {
      this.setState({ selectedNode: { name: context } });
    }
  }
});

exports.default = TestshotWindow;