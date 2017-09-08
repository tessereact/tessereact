'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chunk2 = require('lodash/chunk');

var _chunk3 = _interopRequireDefault(_chunk2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Navigation = require('../../components/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _postJSON = require('./_lib/postJSON');

var _postJSON2 = _interopRequireDefault(_postJSON);

var _onLoad = require('./_lib/onLoad');

var _onLoad2 = _interopRequireDefault(_onLoad);

var _routes = require('./_lib/routes');

var _scenarios = require('./_lib/scenarios');

var _generateTreeNodes = require('./_lib/generateTreeNodes');

var _generateTreeNodes2 = _interopRequireDefault(_generateTreeNodes);

var _prepareStyles = require('./_lib/prepareStyles');

var _prepareStyles2 = _interopRequireDefault(_prepareStyles);

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

var _Button = require('../../styled/Button');

var _Button2 = _interopRequireDefault(_Button);

var _SmallButton = require('../../styled/SmallButton');

var _SmallButton2 = _interopRequireDefault(_SmallButton);

var _Text = require('../../styled/Text');

var _Text2 = _interopRequireDefault(_Text);

require('./diff2html.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// styled components


var SCENARIO_CHUNK_SIZE = Infinity;

var TestshotWindow = _react2.default.createClass({
  displayName: 'TestshotWindow',

  propTypes: {
    data: _react.PropTypes.array.isRequired,
    host: _react.PropTypes.string.isRequired,
    port: _react.PropTypes.string.isRequired,
    routeData: _react.PropTypes.object
  },

  getInitialState: function getInitialState() {
    return {
      scenarios: this.props.data
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    var routeData = this.props.routeData;

    var url = '//' + this.props.host + ':' + this.props.port + '/snapshots-list';

    (0, _onLoad2.default)().then(function () {
      var scenarios = _this.state.scenarios;


      var styles = (0, _prepareStyles2.default)(document.styleSheets);

      var scenariosToLoad = (0, _scenarios.getScenariosToLoad)(routeData, scenarios).map(function (scenario) {
        return {
          name: scenario.name,
          context: scenario.context,
          snapshot: scenario.getSnapshot(),
          options: scenario.options
        };
      });

      var chunks = (0, _chunk3.default)(scenariosToLoad, SCENARIO_CHUNK_SIZE || Infinity);

      return Promise.all(chunks.map(function (scenariosChunk) {
        return (0, _postJSON2.default)(url, { scenarios: scenariosChunk, styles: styles }).then(function (response) {
          return response.json();
        }).then(function (_ref) {
          var responseScenarios = _ref.scenarios;
          return _this.setState({
            scenarios: responseScenarios.reduce(_scenarios.resolveScenario, scenarios)
          });
        }).catch(function (e) {
          return console.log('Snapshot server is not available!', e);
        });
      }));
    }).then(function () {
      var scenarios = _this.state.scenarios;


      (0, _routes.checkForHomeRoute)(routeData, scenarios);
      (0, _routes.checkIfRouteExists)(routeData, scenarios);

      // Report to CI
      if (window.__testshotWSURL) {
        (function () {
          var failingScenarios = scenarios.filter(function (_ref2) {
            var hasDiff = _ref2.hasDiff;
            return hasDiff;
          }).map(function (_ref3) {
            var context = _ref3.context,
                name = _ref3.name;
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
        })();
      }
    }).catch(function (e) {
      console.log('Unexpected error!', e);
    });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    (0, _routes.checkForHomeRoute)(nextProps.routeData, this.state.scenarios);
  },
  render: function render() {
    var _props$routeData = this.props.routeData,
        _props$routeData$para = _props$routeData.params,
        context = _props$routeData$para.context,
        scenario = _props$routeData$para.scenario,
        routeName = _props$routeData.route.name;
    var scenarios = this.state.scenarios;


    return _react2.default.createElement(
      _TestshotContainer2.default,
      null,
      _react2.default.createElement(_Navigation2.default, {
        loadedScenariosCount: scenarios.filter(function (c) {
          return c.status === 'resolved';
        }).length,
        failedScenariosCount: scenarios.filter(function (c) {
          return c.hasDiff;
        }).length,
        scenariosCount: scenarios.length,
        nodes: (0, _generateTreeNodes2.default)(scenarios.filter(function (c) {
          return c.status === 'resolved';
        }))
      }),
      _react2.default.createElement(
        _TestshotContent2.default,
        null,
        routeName === 'context' && this._renderContext(context),
        routeName === 'scenario' && this._renderScenario((0, _scenarios.findScenario)(scenarios, context, scenario))
      )
    );
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
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'a',
            { href: '/contexts/' + scenario.context + '/scenarios/' + scenario.name + '/view', target: '_blank' },
            _react2.default.createElement(
              _Button2.default,
              null,
              'View'
            )
          ),
          scenario.hasDiff && _react2.default.createElement(
            _AcceptButton2.default,
            { onClick: function onClick() {
                return _this2._acceptSnapshot(scenario);
              } },
            'Accept & next'
          )
        )
      ),
      _react2.default.createElement(
        _ComponentPreview2.default,
        null,
        scenario.element
      ),
      _react2.default.createElement(
        'div',
        null,
        this._renderScreenshotData(scenario),
        _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this._renderDiff(scenario) } })
      )
    );
  },
  _renderContext: function _renderContext(contextName) {
    var _this3 = this;

    var scenarios = this.state.scenarios.filter(function (s) {
      return s.context === contextName;
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name);
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

    (0, _postJSON2.default)(url, (0, _scenarios.requestScenarioAcceptance)(scenario)).then(function () {
      var scenarios = (0, _scenarios.acceptScenario)(_this5.state.scenarios, scenario);
      _this5.setState({ scenarios: scenarios });
      (0, _routes.redirectToFirstFailingScenario)(scenarios);
    });
  },
  _requestScreenshot: function _requestScreenshot(scenario, screenshotSizeIndex) {
    var _this6 = this;

    var _props2 = this.props,
        host = _props2.host,
        port = _props2.port;

    var url = '//' + host + ':' + port + '/screenshots';
    var _scenario$screenshotD = scenario.screenshotData,
        before = _scenario$screenshotD.before,
        after = _scenario$screenshotD.after,
        screenshotSizes = _scenario$screenshotD.screenshotSizes;


    var size = screenshotSizes[screenshotSizeIndex];
    this.setState({
      scenarios: (0, _scenarios.changeScenarioScreenshotData)(this.state.scenarios, scenario, function () {
        return { selectedScreenshotSizeIndex: screenshotSizeIndex };
      })
    });

    if (scenario.screenshotData.savedScreenshots && scenario.screenshotData.savedScreenshots[screenshotSizeIndex]) {
      // Screenshot is already cached
      return null;
    }

    (0, _postJSON2.default)(url, { before: before, after: after, size: size }).then(function (response) {
      return response.blob();
    }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      var scenarios = (0, _scenarios.changeScenarioScreenshotData)(_this6.state.scenarios, scenario, function (_ref4) {
        var savedScreenshots = _ref4.savedScreenshots;
        return {
          savedScreenshots: Object.assign([], savedScreenshots, _defineProperty({}, screenshotSizeIndex, url))
        };
      });
      _this6.setState({ scenarios: scenarios });
    });
  },
  _renderDiff: function _renderDiff(scenario) {
    if (scenario.hasDiff) {
      return scenario.diff;
    }
  },
  _renderScreenshotData: function _renderScreenshotData(scenario) {
    var _this7 = this;

    var screenshotData = scenario.screenshotData;


    if (!screenshotData) {
      return null;
    }

    var screenshotSizes = screenshotData.screenshotSizes,
        selectedScreenshotSizeIndex = screenshotData.selectedScreenshotSizeIndex,
        savedScreenshots = screenshotData.savedScreenshots;


    return _react2.default.createElement(
      'div',
      { className: 'd2h-file-wrapper' },
      _react2.default.createElement(
        'div',
        { className: 'd2h-file-header' },
        _react2.default.createElement(
          'span',
          { className: 'd2h-file-name-wrapper' },
          _react2.default.createElement(
            'span',
            { className: 'd2h-icon-wrapper' },
            _react2.default.createElement(
              'svg',
              { className: 'd2h-icon', height: '16', version: '1.1', viewBox: '0 0 12 16', width: '12' },
              _react2.default.createElement('path', { d: 'M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z' })
            )
          ),
          _react2.default.createElement(
            'span',
            { className: 'd2h-file-name' },
            'Screenshots'
          ),
          screenshotSizes.map(function (_ref5, index) {
            var alias = _ref5.alias,
                width = _ref5.width,
                height = _ref5.height;
            return _react2.default.createElement(
              _SmallButton2.default,
              {
                key: index,
                onClick: function onClick() {
                  return _this7._requestScreenshot(scenario, index);
                },
                style: index === selectedScreenshotSizeIndex ? { backgroundColor: '#1abc9c' } : {}
              },
              alias || width + ' \xD7 ' + height
            );
          })
        )
      ),
      this._renderScreenshot(screenshotSizes, savedScreenshots, selectedScreenshotSizeIndex)
    );
  },
  _renderScreenshot: function _renderScreenshot(screenshotSizes, savedScreenshots, index) {
    if (index == null) {
      return null;
    }

    if (!savedScreenshots || !savedScreenshots[index]) {
      return _react2.default.createElement(
        'div',
        { className: 'd2h-screenshot-diff' },
        'Loading...'
      );
    }

    var _screenshotSizes$inde = screenshotSizes[index],
        height = _screenshotSizes$inde.height,
        width = _screenshotSizes$inde.width;


    return _react2.default.createElement(
      'div',
      { className: 'd2h-screenshot-diff' },
      _react2.default.createElement('img', { style: { height: height, width: width }, src: savedScreenshots[index] })
    );
  }
});

exports.default = TestshotWindow;