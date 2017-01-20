'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.context = context;
exports.scenario = scenario;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// styled components

var _styledTestshotContainer = require('./styled/TestshotContainer');

var _styledTestshotContainer2 = _interopRequireDefault(_styledTestshotContainer);

var _styledLink = require('./styled/Link');

var _styledLink2 = _interopRequireDefault(_styledLink);

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
var lodash = require('lodash');
// const enzyme = require('enzyme')
var ReactTestRenderer = require('react-test-renderer');
var classnames = require('classnames');
var ReactDOMServer = require('react-dom/server');
var HtmlDiffer = require("html-differ").HtmlDiffer;
var logger = require('html-differ/lib/logger');
var escape = require('escape-html');
var Formatter = require('./Formatter').Formatter;
var htmlDiffer = new HtmlDiffer({});
var minify = require('html-minifier').minify;

var names = [];
var data = [];

// TODO: Do it properly

function context(callback) {
  callback();
}

// TODO: Delay this function execution
// TODO: Add simulations from prev implementation

function scenario(testName, componentBuilder) {
  if (names.indexOf(testName) > -1) {
    throw new Error('Scenario with name "' + testName + '" already exists');
  }
  names.push(testName);
  var json = ReactTestRenderer.create(componentBuilder()).toJSON();
  return data.push({
    name: testName,
    component: componentBuilder(),
    snapshot: minify(ReactDOMServer.renderToStaticMarkup(componentBuilder()), { removeEmptyAttributes: true })
  });
}

var Testshot = React.createClass({
  displayName: 'Testshot',

  getInitialState: function getInitialState() {
    return {
      selectedSnapshot: this.props.snapshots[0] || {},
      snapshots: this.props.snapshots
    };
  },

  // TODO: Pass URL from config
  componentWillMount: function componentWillMount() {
    var _this = this;

    fetch('//localhost:3001/snapshots-list', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: this.state.snapshots
      }) }).then(function (response) {
      response.json().then(function (json) {
        var newData = _this.state.snapshots.map(function (s) {
          s.previousSnapshot = lodash.find(json, { name: s.name }).previousSnapshot;
          return s;
        });
        // TODO: Avoid setting states few times in a row
        _this.setState({ snapshots: newData });
        _this.pickNextFailingScenario();
      });
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
          lodash.map(this.state.snapshots, function (value, i) {
            return React.createElement(
              'li',
              { key: i },
              React.createElement(
                _styledScenarioLink2['default'],
                {
                  noDiff: _this2.noDiff(value),
                  onClick: _this2.handleSelect.bind(_this2, value.name),
                  key: value.name,
                  active: _this2.state.selectedSnapshot.name === value.name
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
          this.state.selectedSnapshot.name
        ),
        this.state.selectedSnapshot.component,
        !lodash.isEqual(this.state.selectedSnapshot.snapshot, this.state.selectedSnapshot.previousSnapshot) && React.createElement(
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
    fetch('//localhost:3001/snapshots', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        name: this.state.selectedSnapshot.name,
        snapshot: this.state.selectedSnapshot.snapshot
      }) }).then(function () {
      // TODO: Remove page reloading
      window.location.href = '/';
    });
  },

  pickNextFailingScenario: function pickNextFailingScenario() {
    var failingScenario = lodash.find(this.state.snapshots, function (s) {
      return !lodash.isEqual(s.snapshot, s.previousSnapshot);
    });
    if (failingScenario) {
      var newState = _extends({}, this.state);
      newState.selectedSnapshot = failingScenario;
      this.setState(newState);
    }
  },

  noDiff: function noDiff(scenario) {
    return lodash.isEqual(scenario.snapshot, scenario.previousSnapshot);
  },

  renderDiff: function renderDiff() {
    if (this.noDiff(this.state.selectedSnapshot)) {
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
    console.log(Formatter);
    var diff = htmlDiffer.diffHtml(this.state.selectedSnapshot.previousSnapshot, this.state.selectedSnapshot.snapshot);
    return React.createElement(Formatter, { nodes: diff });
  },

  renderPreviousSnapshot: function renderPreviousSnapshot() {
    if (this.state.selectedSnapshot.previousSnapshot) {
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
            JSON.stringify(this.state.selectedSnapshot.previousSnapshot, null, 2)
          )
        )
      );
    }
  },

  handleSelect: function handleSelect(key) {
    this.setState({ selectedSnapshot: lodash.find(this.state.snapshots, ['name', key]) });
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
      this.state.show && React.createElement(Testshot, { snapshots: data }),
      React.createElement(
        _styledLink2['default'],
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
exports.TestshotWrapper = TestshotWrapper;