'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _Navigation = require('../../components/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _requests = require('../_lib/requests');

var _routes = require('../_lib/routes');

var _scenarios = require('../_lib/scenarios');

var _generateTreeNodes = require('../_lib/generateTreeNodes');

var _generateTreeNodes2 = _interopRequireDefault(_generateTreeNodes);

var _link = require('../../lib/link');

var _link2 = _interopRequireDefault(_link);

var _ScenarioContent = require('../ScenarioContent');

var _ScenarioContent2 = _interopRequireDefault(_ScenarioContent);

var _DemoContent = require('../DemoContent');

var _DemoContent2 = _interopRequireDefault(_DemoContent);

var _Container = require('../../styled/Container');

var _Container2 = _interopRequireDefault(_Container);

var _Header = require('../../styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Content = require('../../styled/Content');

var _Content2 = _interopRequireDefault(_Content);

var _ComponentPreview = require('../../styled/ComponentPreview');

var _ComponentPreview2 = _interopRequireDefault(_ComponentPreview);

var _ScenarioBlock = require('../../styled/ScenarioBlock');

var _ScenarioBlock2 = _interopRequireDefault(_ScenarioBlock);

var _ScenarioBlockContent = require('../../styled/ScenarioBlockContent');

var _ScenarioBlockContent2 = _interopRequireDefault(_ScenarioBlockContent);

var _ScenarioBlockHeader = require('../../styled/ScenarioBlockHeader');

var _ScenarioBlockHeader2 = _interopRequireDefault(_ScenarioBlockHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// react components


// styled components


var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {
  // Ignore optional peer dependency
}

var SCENARIO_CHUNK_SIZE = Infinity;

/**
 * UI of main Tessereact window.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 * @property {String} props.host - host of the Tessereact server
 * @property {String} props.port - port of the Tessereact server
 * @property {RouteData} props.routeData
 */

var MainView = function (_React$Component) {
  _inherits(MainView, _React$Component);

  function MainView(props, context) {
    _classCallCheck(this, MainView);

    var _this = _possibleConstructorReturn(this, (MainView.__proto__ || Object.getPrototypeOf(MainView)).call(this, props, context));

    _this.state = {
      scenarios: props.data
    };
    return _this;
  }

  /**
   * Load snapshot diffs from the server
   */


  _createClass(MainView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var css = void 0;
      var routeData = this.props.routeData;

      var url = '//' + this.props.host + ':' + this.props.port + '/api/read-snapshots';

      var startDate = Date.now();

      Promise.all([
      // Get config from server
      window.__tessereactConfig ? Promise.resolve(null) : (0, _requests.getJSON)('//' + this.props.host + ':' + this.props.port + '/api/config').then(function (config) {
        window.__tessereactConfig = config;
      }),

      // Get CSS from server
      this.props.data.some(function (_ref) {
        var css = _ref.options.css;
        return css;
      }) ? (0, _requests.getJSON)('//' + this.props.host + ':' + this.props.port + '/api/css').then(function (_ref2) {
        var scenarios = _ref2.scenarios;
        css = scenarios;
      }) : Promise.resolve(null)]).then(function () {
        var chunksToLoad = (0, _scenarios.getChunksToLoad)(routeData, _this2.state.scenarios, SCENARIO_CHUNK_SIZE || Infinity).map(function (chunk) {
          return chunk.map(function (scenario) {
            return {
              name: scenario.name,
              context: scenario.context,
              options: scenario.options
            };
          });
        });

        // Get old snapshots from server
        return Promise.all(chunksToLoad.map(function (scenariosChunk) {
          return (0, _requests.postJSON)(url, { scenarios: scenariosChunk }).then(function (_ref3) {
            var responseScenarios = _ref3.scenarios;

            var newScenarios = responseScenarios.reduce(function (acc, s) {
              return (0, _scenarios.resolveScenario)(acc, s, css);
            }, _this2.state.scenarios);
            _this2.setState({ scenarios: newScenarios });
          }).catch(function (e) {
            return console.log('Snapshot server is not available!', e);
          });
        }));
      }).then(function () {
        var scenarios = _this2.state.scenarios;


        console.log('Finished loading in ' + (Date.now() - startDate));

        var search = window.location.search.slice(1);

        var _queryString$parse = _qs2.default.parse(search),
            wsPort = _queryString$parse.wsPort;
        // Report to CI


        if (wsPort) {
          (function () {
            var ws = new window.WebSocket('ws://localhost:' + wsPort);
            ws.addEventListener('open', function () {
              ws.send(JSON.stringify((0, _scenarios.prepareCIReport)(scenarios)));
            });
          })();
        } else {
          if (window.__tessereactDemoMode) {
            (0, _routes.checkForHomeRouteDemoMode)(routeData);
          } else {
            (0, _routes.checkForHomeRoute)(routeData, scenarios);
          }
          (0, _routes.checkIfRouteExists)(routeData, scenarios);
        }
      }).catch(function (e) {
        console.log('Unexpected error!', e);
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _routes.checkForHomeRoute)(nextProps.routeData, this.state.scenarios);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$routeData = this.props.routeData,
          _props$routeData$para = _props$routeData.params,
          context = _props$routeData$para.context,
          scenario = _props$routeData$para.scenario,
          routeName = _props$routeData.route.name;
      var scenarios = this.state.scenarios;


      return _react2.default.createElement(
        _Container2.default,
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
          })),
          selectedRoute: { context: context, scenario: scenario, name: routeName }
        }),
        _react2.default.createElement(
          _Content2.default,
          null,
          routeName === 'context' && this._renderContext(context),
          routeName === 'scenario' && this._renderScenario((0, _scenarios.findScenario)(scenarios, context, scenario)),
          routeName === 'demo' && _react2.default.createElement(_DemoContent2.default, null)
        ),
        window.__tessereactDemoMode && window.__tessereactDemoMode.ribbon
      );
    }

    /**
     * Render UI element, which contains header, scenario and diffs.
     * Represents selected scenario.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderScenario',
    value: function _renderScenario(scenario) {
      var _this3 = this;

      var _props$routeData$para2 = this.props.routeData.params,
          context = _props$routeData$para2.context,
          name = _props$routeData$para2.scenario;


      return _react2.default.createElement(_ScenarioContent2.default, {
        scenario: scenario || { name: name, context: context },
        onAcceptSnapshot: scenario ? function () {
          return _this3._acceptSnapshot(scenario);
        } : null,
        onRequestScreenshot: scenario ? function (sizeIndex) {
          return _this3._requestScreenshot(scenario, sizeIndex);
        } : null
      });
    }

    /**
     * Render UI element, which contains header and scenarios of the selected context.
     * @param {String} contextName
     */

  }, {
    key: '_renderContext',
    value: function _renderContext(contextName) {
      var scenarios = this.state.scenarios.filter(function (s) {
        return s.context === contextName;
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      return _react2.default.createElement(
        _Content2.default.Wrapper,
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
            var params = { context: s.context || 'null', scenario: s.name };
            return _react2.default.createElement(
              _ScenarioBlock2.default,
              { key: s.name },
              _react2.default.createElement(
                _link2.default,
                {
                  name: 'scenario',
                  params: params,
                  component: function component(props) {
                    return _react2.default.createElement(_ScenarioBlockHeader2.default, _extends({ hasDiff: s.hasDiff }, props));
                  }
                },
                s.name
              ),
              _react2.default.createElement(
                _link2.default,
                { name: 'scenario', params: params, component: 'div' },
                _react2.default.createElement(
                  _ScenarioBlockContent2.default,
                  { key: s.name },
                  s.snapshot ? _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: s.snapshot } }) : _react2.default.createElement(
                    'div',
                    null,
                    'Loading...'
                  )
                )
              )
            );
          })
        )
      );
    }

    /**
     * Mark the selected scenario as accepted.
     * Request the server to accept the snapshot.
     * Redirect to the next failing scenario.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_acceptSnapshot',
    value: function _acceptSnapshot(scenario) {
      var _this4 = this;

      var _props = this.props,
          host = _props.host,
          port = _props.port;

      var url = '//' + host + ':' + port + '/api/write-snapshot';

      (0, _requests.postJSON)(url, (0, _scenarios.requestScenarioAcceptance)(scenario)).then(function () {
        var scenarios = (0, _scenarios.acceptScenario)(_this4.state.scenarios, scenario);
        _this4.setState({ scenarios: scenarios });
        (0, _routes.redirectToFirstFailingScenario)(scenarios);
      });
    }

    /**
     * Request the server to send a screenshot diff of the selected scenario and dimensions.
     * Cache the screenshot when it arrives.
     * @param {ScenarioObject} scenario
     * @param {Number} screenshotSizeIndex
     */

  }, {
    key: '_requestScreenshot',
    value: function _requestScreenshot(scenario, screenshotSizeIndex) {
      var _this5 = this;

      var _props2 = this.props,
          host = _props2.host,
          port = _props2.port;

      var url = '//' + host + ':' + port + '/api/screenshot';
      var name = scenario.name,
          context = scenario.context;
      var _scenario$screenshotD = scenario.screenshotData,
          before = _scenario$screenshotD.before,
          after = _scenario$screenshotD.after,
          screenshotSizes = _scenario$screenshotD.screenshotSizes,
          savedScreenshots = _scenario$screenshotD.savedScreenshots;


      var screenshotIsAlreadyCached = savedScreenshots && savedScreenshots[screenshotSizeIndex];

      var size = screenshotSizes[screenshotSizeIndex];
      this.setState({
        scenarios: (0, _scenarios.changeScenarioScreenshotData)(this.state.scenarios, scenario, function (_ref4) {
          var selectedScreenshotSizeIndex = _ref4.selectedScreenshotSizeIndex,
              savedScreenshots = _ref4.savedScreenshots;
          return {
            selectedScreenshotSizeIndex: selectedScreenshotSizeIndex === screenshotSizeIndex ? null : screenshotSizeIndex,
            savedScreenshots: screenshotIsAlreadyCached ? savedScreenshots : Object.assign({}, savedScreenshots, _defineProperty({}, screenshotSizeIndex, {
              status: 'loading'
            }))
          };
        })
      });

      if (screenshotIsAlreadyCached) {
        return null;
      }

      (0, _requests.postJSONAndGetURL)(url, { name: name, context: context, before: before, after: after, size: size, sizeIndex: screenshotSizeIndex }).then(function (url) {
        var scenarios = (0, _scenarios.changeScenarioScreenshotData)(_this5.state.scenarios, scenario, function (_ref5) {
          var savedScreenshots = _ref5.savedScreenshots;
          return {
            savedScreenshots: Object.assign([], savedScreenshots, _defineProperty({}, screenshotSizeIndex, {
              status: 'cached',
              url: url
            }))
          };
        });
        _this5.setState({ scenarios: scenarios });
      });
    }
  }]);

  return MainView;
}(_react2.default.Component);

if (PropTypes) {
  MainView.propTypes = {
    data: PropTypes.array.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    routeData: PropTypes.object.isRequired
  };
}

exports.default = MainView;