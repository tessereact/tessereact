'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.context = context;
exports.scenario = scenario;
var React = require('react');
var lodash = require('lodash');
// const enzyme = require('enzyme')
var ReactTestRenderer = require('react-test-renderer');
var classnames = require('classnames');
var jsondiffpatch = require('jsondiffpatch').create({});
var jsondiffpatchHtmlFormatter = require('jsondiffpatch/src/formatters/html');
var ReactDOMServer = require('react-dom/server');
var HtmlDiffer = require("html-differ").HtmlDiffer;
var logger = require('html-differ/lib/logger');
var escape = require('escape-html');

console.log(jsondiffpatchHtmlFormatter);

var data = [];

// TODO: Do it properly

function context(callback) {
  callback();
}

var Formatter = React.createClass({
  displayName: 'Formatter',

  render: function render() {
    var nodes = this.props.nodes.map(function (n, i) {
      return n.value.replace(/\>\</g, '>+++<').split('+++').map(function (el) {
        return {
          value: el,
          added: n.added,
          removed: n.removed,
          tag: !!el.match('>')
        };
      });
    });

    console.log(lodash.flatten(nodes));

    return React.createElement(
      'pre',
      null,
      lodash.flatten(nodes).map(function (n, i) {
        return React.createElement(
          'span',
          { key: i, className: classnames({ 'Testshot-green': n.added, 'Testshot-red': n.removed }) },
          n.value,
          n.tag && React.createElement('br', null)
        );
      })
    );
  }
});

// TODO: Delay this function execution
// TODO: Validate name uniqueness
// TODO: Add simulations from prev implementation

function scenario(testName, componentBuilder) {
  var json = ReactTestRenderer.create(componentBuilder()).toJSON();
  return data.push({
    name: testName,
    component: componentBuilder(),
    // TODO: Remove this hack
    // snapshot: JSON.parse(JSON.stringify(json))
    snapshot: ReactDOMServer.renderToStaticMarkup(componentBuilder())
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

  // Simulation tricks
  // componentDidMount () {
  //   eval('('+this.state.selectedSnapshot.simulate+')($(".Testshot-component"))')
  // },

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
      'div',
      { className: 'Testshot show' },
      React.createElement(
        'div',
        { className: 'Testshot-sidebar' },
        React.createElement(
          'h3',
          { className: 'Testshot-header' },
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
                'a',
                { onClick: _this2.handleSelect.bind(_this2, value.name), key: value.name, className: classnames('Testshot-btn', { active: _this2.state.selectedSnapshot.name === value.name, 'btn-success': _this2.noDiff(value), 'btn-danger': !_this2.noDiff(value) }) },
                value.name
              )
            );
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'Testshot-content' },
        React.createElement(
          'h3',
          { className: 'Testshot-componentHeader' },
          this.state.selectedSnapshot.name
        ),
        React.createElement(
          'div',
          { className: 'Testshot-component' },
          this.state.selectedSnapshot.component
        ),
        !lodash.isEqual(this.state.selectedSnapshot.snapshot, this.state.selectedSnapshot.previousSnapshot) && React.createElement(
          'button',
          { className: 'Testshot-acceptButton', type: 'button', onClick: this.acceptSnapshot.bind(this) },
          'Accept'
        )
      ),
      React.createElement(
        'div',
        { className: 'Testshot-sidebar right' },
        React.createElement(
          'h3',
          { className: 'Testshot-header' },
          'Diff'
        ),
        this.renderDiff()
      )
    );
  },

  acceptSnapshot: function acceptSnapshot() {
    console.log('acceptSnapshot');
    fetch('//localhost:3001/snapshots', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        name: this.state.selectedSnapshot.name,
        snapshot: this.state.selectedSnapshot.snapshot
      }) }).then((function () {
      console.log('previousSnapshot accepted', this.state.selectedSnapshot.snapshot);
      window.location.href = '/';
    }).bind(this));
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
        'div',
        { className: 'alert alert-success', role: 'alert' },
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
    var delta = jsondiffpatch.diff(this.state.selectedSnapshot.previousSnapshot, this.state.selectedSnapshot.snapshot);
    var data = jsondiffpatchHtmlFormatter.format(delta, this.state.selectedSnapshot.previousSnapshot);
    var htmlDiffer = new HtmlDiffer({});
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
        'a',
        { onClick: this.toggleTestshot.bind(this), className: 'Testshot-button', href: '#' },
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