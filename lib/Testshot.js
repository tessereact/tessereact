'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _filter2 = require('lodash/filter');

var _filter3 = _interopRequireDefault(_filter2);

exports.scenario = scenario;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _htmlDiffer = require('html-differ');

var _Formatter = require('./Formatter');

var _Formatter2 = _interopRequireDefault(_Formatter);

var _Fetch = require('./Fetch');

var _TestshotContainer = require('./styled/TestshotContainer');

var _TestshotContainer2 = _interopRequireDefault(_TestshotContainer);

var _TestshotToggle = require('./styled/TestshotToggle');

var _TestshotToggle2 = _interopRequireDefault(_TestshotToggle);

var _Header = require('./styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Sidebar = require('./styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _AcceptButton = require('./styled/AcceptButton');

var _AcceptButton2 = _interopRequireDefault(_AcceptButton);

var _TestshotContent = require('./styled/TestshotContent');

var _TestshotContent2 = _interopRequireDefault(_TestshotContent);

var _ScenarioLink = require('./styled/ScenarioLink');

var _ScenarioLink2 = _interopRequireDefault(_ScenarioLink);

var _FilterInput = require('./styled/FilterInput');

var _FilterInput2 = _interopRequireDefault(_FilterInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// styled components
var htmlDiffer = new _htmlDiffer.HtmlDiffer({});
var names = [];
var data = [];

// TODO: Add simulations from prev implementation
function scenario(name, type) {
  if (names.indexOf(name) > -1) {
    throw new Error('Scenario with name "' + name + '" already exists');
  }
  names.push(name);

  data.push(function () {
    var scenarioElement = _react2.default.createElement(type, { key: name });
    return {
      name: name,
      element: scenarioElement,
      // TODO: Handle exception during rendering,
      // store and then display it
      snapshot: _server2.default.renderToStaticMarkup(scenarioElement)
    };
  });
}

var Testshot = _react2.default.createClass({
  displayName: 'Testshot',
  getInitialState: function getInitialState() {
    var scenarios = this.props.data.map(function (f) {
      return f();
    });
    return {
      selectedScenario: scenarios[0] || {},
      scenarios: scenarios,
      filter: ''
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
          s.previousSnapshot = (0, _find3.default)(json, { name: s.name }).previousSnapshot;
          s.show = true;
          return s;
        });
        // TODO: Avoid setting states few times in a row
        _this.setState({ scenarios: newData });
        _this.pickNextFailingScenario();
      });
    }, function () {
      window.alert('Snapshot server is not available!');
    });
  },
  _filterScenarios: function _filterScenarios(event) {
    var newState = Object.assign({}, this.state);
    newState.filter = event.target.value;
    if (event.target.value.length >= 2) {
      newState.scenarios.map(function (s) {
        s.show = s.name.toLowerCase().match(event.target.value);
      });
    } else {
      newState.scenarios.map(function (s) {
        s.show = true;
      });
    }
    this.setState(newState);
  },
  render: function render() {
    var _this2 = this;

    return _react2.default.createElement(
      _TestshotContainer2.default,
      null,
      _react2.default.createElement(
        _Sidebar2.default,
        null,
        _react2.default.createElement(
          _Header2.default,
          null,
          'Scenarios'
        ),
        _react2.default.createElement(_FilterInput2.default, { placeholder: 'filter', type: 'text', value: this.state.filter, onChange: this._filterScenarios }),
        _react2.default.createElement(
          'ul',
          null,
          (0, _map3.default)((0, _filter3.default)(this.state.scenarios, function (s) {
            return s.show;
          }), function (value, i) {
            return _react2.default.createElement(
              'li',
              { key: i },
              _react2.default.createElement(
                _ScenarioLink2.default,
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
      _react2.default.createElement(
        _TestshotContent2.default,
        null,
        _react2.default.createElement(
          _Header2.default,
          null,
          this.state.selectedScenario.name
        ),
        this.state.selectedScenario.element,
        !(0, _isEqual3.default)(this.state.selectedScenario.snapshot, this.state.selectedScenario.previousSnapshot) && _react2.default.createElement(
          _AcceptButton2.default,
          { onClick: this.acceptSnapshot.bind(this) },
          'Accept'
        )
      ),
      _react2.default.createElement(
        _Sidebar2.default,
        { right: true },
        _react2.default.createElement(
          _Header2.default,
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
      var newState = Object.assign({}, _this3.state);
      newState.selectedScenario.previousSnapshot = newState.selectedScenario.snapshot;
      _this3.setState(newState);
      _this3.pickNextFailingScenario();
    });
  },
  pickNextFailingScenario: function pickNextFailingScenario() {
    var failingScenario = (0, _find3.default)(this.state.scenarios, function (s) {
      return !(0, _isEqual3.default)(s.snapshot, s.previousSnapshot);
    });
    if (failingScenario) {
      var newState = Object.assign({}, this.state);
      newState.selectedScenario = failingScenario;
      this.setState(newState);
    }
  },
  noDiff: function noDiff(scenario) {
    return (0, _isEqual3.default)(scenario.snapshot, scenario.previousSnapshot);
  },
  renderDiff: function renderDiff() {
    if (this.noDiff(this.state.selectedScenario)) {
      return _react2.default.createElement(
        'p',
        null,
        'Snapshots are identical!'
      );
    } else {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'pre',
          null,
          this.computeDiff()
        )
      );
    }
  },
  computeDiff: function computeDiff() {
    var diff = htmlDiffer.diffHtml(this.state.selectedScenario.previousSnapshot, this.state.selectedScenario.snapshot);
    return _react2.default.createElement(_Formatter2.default, { nodes: diff });
  },
  renderPreviousSnapshot: function renderPreviousSnapshot() {
    if (this.state.selectedScenario.previousSnapshot) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          null,
          'Previous snapshot:'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'pre',
            null,
            JSON.stringify(this.state.selectedScenario.previousSnapshot, null, 2)
          )
        )
      );
    }
  },
  handleSelect: function handleSelect(key) {
    this.setState({ selectedScenario: (0, _find3.default)(this.state.scenarios, ['name', key]) });
  }
});

var TestshotComponent = _react2.default.createClass({
  displayName: 'TestshotComponent',
  getInitialState: function getInitialState() {
    return {
      show: window.localStorage.getItem('testing') === 'true'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      null,
      this.state.show && _react2.default.createElement(Testshot, { host: this.props.server.host, port: this.props.server.port, data: data }),
      _react2.default.createElement(
        _TestshotToggle2.default,
        { onClick: this.toggleTestshot.bind(this), href: '#' },
        'Testshot'
      )
    );
  },
  toggleTestshot: function toggleTestshot() {
    window.localStorage.setItem('testing', !this.state.show);
    this.setState({ show: !this.state.show });
  }
});

exports.default = TestshotComponent;