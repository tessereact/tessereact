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

var _AcceptButton = require('../../styled/AcceptButton');

var _AcceptButton2 = _interopRequireDefault(_AcceptButton);

var _TestshotContent = require('../../styled/TestshotContent');

var _TestshotContent2 = _interopRequireDefault(_TestshotContent);

var _ComponentPreview = require('../../styled/ComponentPreview');

var _ComponentPreview2 = _interopRequireDefault(_ComponentPreview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var htmlDiffer = new _htmlDiffer.HtmlDiffer({
  ignoreWhitespaces: false
});

// styled components


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
        nodes: (0, _helpers.generateTreeNodes)(this.state.scenarios),
        selectedScenario: this.state.selectedScenario,
        selectScenario: this._handleSelect
      }),
      _react2.default.createElement(
        _TestshotContent2.default,
        null,
        _react2.default.createElement(
          _ComponentPreview2.default,
          null,
          _react2.default.createElement(
            _Header2.default,
            null,
            this.state.selectedScenario.name
          ),
          this.state.selectedScenario.element
        ),
        this._renderDiff(),
        this.state.selectedScenario.hasDiff && _react2.default.createElement(
          _AcceptButton2.default,
          { onClick: this._acceptSnapshot },
          'Accept'
        )
      )
    );
  },
  _acceptSnapshot: function _acceptSnapshot() {
    var _this2 = this;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots';
    (0, _fetch.postJSON)(url, (0, _helpers.requestScenarioAcceptance)(this.state.selectedScenario)).then(function () {
      _this2.setState((0, _helpers.pickFailingScenario)((0, _helpers.acceptCurrentScenario)(_this2.state)));
    });
  },
  _renderDiff: function _renderDiff() {
    if (this.state.selectedScenario.hasDiff) {
      return this._computeDiff();
    } else {
      return _react2.default.createElement(
        'p',
        null,
        'Snapshots are identical!'
      );
    }
  },
  _computeDiff: function _computeDiff() {
    var previousSnapshot = this.state.selectedScenario.previousSnapshot;
    var snapshot = this.state.selectedScenario.snapshot;
    var diff = htmlDiffer.diffHtml(previousSnapshot, snapshot);
    return _react2.default.createElement(_Diff2.default, { nodes: diff });
  },
  _handleSelect: function _handleSelect(key, context) {
    this.setState({ selectedScenario: (0, _find3.default)(this.state.scenarios, { name: key, context: context }) });
  }
});

exports.default = TestshotWindow;