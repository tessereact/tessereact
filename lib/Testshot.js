'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// const enzyme = require('enzyme')

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDomServer = require('react-dom/server');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var _htmlDiffer = require("html-differ");

var _htmlDifferLibLogger = require('html-differ/lib/logger');

var _htmlDifferLibLogger2 = _interopRequireDefault(_htmlDifferLibLogger);

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var _Formatter = require('./Formatter');

var _Formatter2 = _interopRequireDefault(_Formatter);

var _Fetch = require('./Fetch');

// styled components

var _styledTestshotContainer = require('./styled/TestshotContainer');

var _styledTestshotContainer2 = _interopRequireDefault(_styledTestshotContainer);

var _styledTestshotToggle = require('./styled/TestshotToggle');

var _styledTestshotToggle2 = _interopRequireDefault(_styledTestshotToggle);

var _styledHeader = require('./styled/Header');

var _styledHeader2 = _interopRequireDefault(_styledHeader);

var _styledSidebar = require('./styled/Sidebar');

var _styledSidebar2 = _interopRequireDefault(_styledSidebar);

var _styledAcceptButton = require('./styled/AcceptButton');

var _styledAcceptButton2 = _interopRequireDefault(_styledAcceptButton);

var _styledTestshotContent = require('./styled/TestshotContent');

var _styledTestshotContent2 = _interopRequireDefault(_styledTestshotContent);

var _styledScenarioLink = require('./styled/ScenarioLink');

var _styledScenarioLink2 = _interopRequireDefault(_styledScenarioLink);

var React = require('react');

var htmlDiffer = new _htmlDiffer.HtmlDiffer({});
var names = [];
var data = [];

// TODO: Do it properly
var context = function context(callback) {
  callback();
};

exports.context = context;
// TODO: Add simulations from prev implementation
var scenario = function scenario(testName, componentBuilder) {
  if (names.indexOf(testName) > -1) {
    throw new Error('Scenario with name "' + testName + '" already exists');
  }
  names.push(testName);
  data.push(function () {
    var component = componentBuilder();
    return {
      name: testName,
      component: component,
      snapshot: _reactDomServer2['default'].renderToStaticMarkup(component)
    };
  });
};

exports.scenario = scenario;
var Testshot = React.createClass({
  displayName: 'Testshot',

  getInitialState: function getInitialState() {
    var scenarios = this.props.data.map(function (f) {
      return f();
    });
    return {
      selectedScenario: scenarios[0] || {},
      scenarios: scenarios
    };
  },

  // TODO: Pass URL from config
  componentWillMount: function componentWillMount() {
    var _this = this;

    if (!this.props.host || !this.props.port) throw new Error('Configure "host" and "port" please.');
    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots-list';
    (0, _Fetch.postJSON)(url, {
      data: this.state.scenarios.map(function (s) {
        return { name: s.name };
      })
    }).then(function (response) {
      response.json().then(function (json) {
        var newData = _this.state.scenarios.map(function (s) {
          s.previousSnapshot = _lodash2['default'].find(json, { name: s.name }).previousSnapshot;
          return s;
        });
        // TODO: Avoid setting states few times in a row
        _this.setState({ scenarios: newData });
        _this.pickNextFailingScenario();
      });
    }, function () {
      alert('Snapshot server is not available!');
    });
  },

  render: function render() {
    var _this2 = this;

    return React.createElement(
      _styledTestshotContainer2['default'],
      null,
      React.createElement(
        _styledSidebar2['default'],
        null,
        React.createElement(
          _styledHeader2['default'],
          null,
          'Scenarios'
        ),
        React.createElement(
          'ul',
          null,
          _lodash2['default'].map(this.state.scenarios, function (value, i) {
            return React.createElement(
              'li',
              { key: i },
              React.createElement(
                _styledScenarioLink2['default'],
                {
                  noDiff: _this2.noDiff(value),
                  onClick: _this2.handleSelect.bind(_this2, value.name),
                  key: value.name,
                  active: _this2.state.selectedScenario.name === value.name
                },
                value.name
              )
            );
          })
        )
      ),
      React.createElement(
        _styledTestshotContent2['default'],
        null,
        React.createElement(
          _styledHeader2['default'],
          null,
          this.state.selectedScenario.name
        ),
        this.state.selectedScenario.component,
        !_lodash2['default'].isEqual(this.state.selectedScenario.snapshot, this.state.selectedScenario.previousSnapshot) && React.createElement(
          _styledAcceptButton2['default'],
          { onClick: this.acceptSnapshot.bind(this) },
          'Accept'
        )
      ),
      React.createElement(
        _styledSidebar2['default'],
        { right: true },
        React.createElement(
          _styledHeader2['default'],
          null,
          'Diff'
        ),
        this.renderDiff()
      )
    );
  },

  // TODO: Extract requests to a different module
  acceptSnapshot: function acceptSnapshot() {
    var _this3 = this;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots';
    (0, _Fetch.postJSON)(url, {
      name: this.state.selectedScenario.name,
      snapshot: this.state.selectedScenario.snapshot
    }).then(function () {
      var newState = _extends({}, _this3.state);
      newState.selectedScenario.previousSnapshot = newState.selectedScenario.snapshot;
      _this3.setState(newState);
      _this3.pickNextFailingScenario();
    });
  },

  pickNextFailingScenario: function pickNextFailingScenario() {
    var failingScenario = _lodash2['default'].find(this.state.scenarios, function (s) {
      return !_lodash2['default'].isEqual(s.snapshot, s.previousSnapshot);
    });
    if (failingScenario) {
      var newState = _extends({}, this.state);
      newState.selectedScenario = failingScenario;
      this.setState(newState);
    }
  },

  noDiff: function noDiff(scenario) {
    return _lodash2['default'].isEqual(scenario.snapshot, scenario.previousSnapshot);
  },

  renderDiff: function renderDiff() {
    if (this.noDiff(this.state.selectedScenario)) {
      return React.createElement(
        'p',
        null,
        'Snapshots are identical!'
      );
    } else {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'pre',
          null,
          this.computeDiff()
        )
      );
    }
  },

  computeDiff: function computeDiff() {
    var diff = htmlDiffer.diffHtml(this.state.selectedScenario.previousSnapshot, this.state.selectedScenario.snapshot);
    return React.createElement(_Formatter2['default'], { nodes: diff });
  },

  renderPreviousSnapshot: function renderPreviousSnapshot() {
    if (this.state.selectedScenario.previousSnapshot) {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          null,
          'Previous snapshot:'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'pre',
            null,
            JSON.stringify(this.state.selectedScenario.previousSnapshot, null, 2)
          )
        )
      );
    }
  },

  handleSelect: function handleSelect(key) {
    this.setState({ selectedScenario: _lodash2['default'].find(this.state.scenarios, ['name', key]) });
  }

});

// TODO: Button and Testshot workspace should be rendered only in Dev environment
var TestshotWrapper = React.createClass({
  displayName: 'TestshotWrapper',

  getInitialState: function getInitialState() {
    return {
      show: localStorage.getItem('testing') == 'true'
    };
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      this.props.children,
      this.state.show && React.createElement(Testshot, { host: this.props.server.host, port: this.props.server.port, data: data }),
      React.createElement(
        _styledTestshotToggle2['default'],
        { onClick: this.toggleTestshot.bind(this), href: '#' },
        'Testshot'
      )
    );
  },

  toggleTestshot: function toggleTestshot() {
    localStorage.setItem('testing', !this.state.show);
    this.setState({ show: !this.state.show });
  }
});

exports['default'] = TestshotWrapper;