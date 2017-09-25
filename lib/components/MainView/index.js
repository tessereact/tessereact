'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chunk2 = require('lodash/chunk');

var _chunk3 = _interopRequireDefault(_chunk2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _formatHTML = require('./_lib/formatHTML');

var _formatHTML2 = _interopRequireDefault(_formatHTML);

var _styles = require('./_lib/styles');

var _link = require('../../lib/link');

var _link2 = _interopRequireDefault(_link);

var _ScenarioContent = require('../ScenarioContent');

var _ScenarioContent2 = _interopRequireDefault(_ScenarioContent);

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

var _Text = require('../../styled/Text');

var _Text2 = _interopRequireDefault(_Text);

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

// We don't need the component to update right away when `cssLoaded` is changed
// so we keep it as an external variable instead of state.
var cssLoaded = false;

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

      var routeData = this.props.routeData;

      var url = '//' + this.props.host + ':' + this.props.port + '/snapshots-list';

      (0, _onLoad2.default)().then(function () {
        var scenarios = _this2.state.scenarios;

        var styles = (0, _styles.prepareStyles)(document.styleSheets);

        var scenariosToLoad = (0, _scenarios.getScenariosToLoad)(routeData, scenarios).map(function (scenario) {
          var snapshotCSS = scenario.options.css ? (0, _styles.buildSnapshotCSS)(styles, document.getElementById((0, _styles.generateScenarioId)(scenario)), document.documentElement, document.body) : null;

          return {
            name: scenario.name,
            context: scenario.context,
            snapshot: (0, _formatHTML2.default)(scenario.getSnapshot()),
            snapshotCSS: snapshotCSS,
            options: scenario.options
          };
        });

        cssLoaded = true;

        var chunks = (0, _chunk3.default)(scenariosToLoad, SCENARIO_CHUNK_SIZE || Infinity);

        return Promise.all(chunks.map(function (scenariosChunk) {
          return (0, _postJSON2.default)(url, { scenarios: scenariosChunk }).then(function (response) {
            return response.json();
          }).then(function (_ref) {
            var responseScenarios = _ref.scenarios;
            return _this2.setState({
              scenarios: responseScenarios.reduce(_scenarios.resolveScenario, scenarios)
            });
          }).catch(function (e) {
            return console.log('Snapshot server is not available!', e);
          });
        }));
      }).then(function () {
        var scenarios = _this2.state.scenarios;


        (0, _routes.checkForHomeRoute)(routeData, scenarios);
        (0, _routes.checkIfRouteExists)(routeData, scenarios);

        // Report to CI
        if (window.__tessereactWSURL) {
          (function () {
            var failingScenarios = scenarios.filter(function (_ref2) {
              var hasDiff = _ref2.hasDiff;
              return hasDiff;
            }).map(function (_ref3) {
              var context = _ref3.context,
                  name = _ref3.name;
              return { context: context, name: name };
            });

            var ws = new window.WebSocket(window.__tessereactWSURL);
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
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      cssLoaded = false;
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
        this._renderFetchCSS(),
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
          selectedRoute: { context: context, scenario: scenario }
        }),
        _react2.default.createElement(
          _Content2.default,
          null,
          routeName === 'context' && this._renderContext(context),
          routeName === 'scenario' && this._renderScenario((0, _scenarios.findScenario)(scenarios, context, scenario))
        )
      );
    }

    /**
     * Render UI element, which contains all of the scenarios with option `css`=true.
     * From it we will fetch the css snapshots
     */

  }, {
    key: '_renderFetchCSS',
    value: function _renderFetchCSS() {
      if (cssLoaded) {
        return null;
      }

      var scenarios = this.props.data.filter(function (_ref4) {
        var css = _ref4.options.css;
        return css;
      });
      return _react2.default.createElement(
        'div',
        { style: { display: 'none' } },
        scenarios.map(function (scenario, index) {
          return _react2.default.createElement('div', {
            id: (0, _styles.generateScenarioId)(scenario),
            key: index,
            dangerouslySetInnerHTML: { __html: scenario.getSnapshot() }
          });
        })
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

      return _react2.default.createElement(_ScenarioContent2.default, {
        scenario: scenario,
        onAcceptSnapshot: function onAcceptSnapshot() {
          return _this3._acceptSnapshot(scenario);
        },
        onRequestScreenshot: function onRequestScreenshot(sizeIndex) {
          return _this3._requestScreenshot(scenario, sizeIndex);
        }
      });
    }

    /**
     * Render UI element, which contains header and scenarios of the selected context.
     * @param {String} contextName
     */

  }, {
    key: '_renderContext',
    value: function _renderContext(contextName) {
      var _this4 = this;

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
              _link2.default,
              { name: 'scenario', params: params },
              _react2.default.createElement(
                _ScenarioBlock2.default,
                { key: s.name },
                _this4._renderSectionHeader(s),
                _react2.default.createElement(
                  _ScenarioBlockContent2.default,
                  { key: s.name },
                  s.snapshot && _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: s.snapshot } })
                )
              )
            );
          })
        )
      );
    }

    /**
     * Render scenario header inside the selected context.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderSectionHeader',
    value: function _renderSectionHeader(s) {
      return s.hasDiff ? _react2.default.createElement(
        _Text2.default,
        { color: '#e91e63', fontSize: '14px' },
        s.name
      ) : _react2.default.createElement(
        _Text2.default,
        { color: '#8f9297', fontSize: '14px' },
        s.name
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
      var _this6 = this;

      var _props2 = this.props,
          host = _props2.host,
          port = _props2.port;

      var url = '//' + host + ':' + port + '/screenshots';
      var _scenario$screenshotD = scenario.screenshotData,
          before = _scenario$screenshotD.before,
          after = _scenario$screenshotD.after,
          screenshotSizes = _scenario$screenshotD.screenshotSizes,
          savedScreenshots = _scenario$screenshotD.savedScreenshots;


      var screenshotIsAlreadyCached = savedScreenshots && savedScreenshots[screenshotSizeIndex];

      var size = screenshotSizes[screenshotSizeIndex];
      this.setState({
        scenarios: (0, _scenarios.changeScenarioScreenshotData)(this.state.scenarios, scenario, function (_ref5) {
          var selectedScreenshotSizeIndex = _ref5.selectedScreenshotSizeIndex,
              savedScreenshots = _ref5.savedScreenshots;
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

      (0, _postJSON2.default)(url, { before: before, after: after, size: size }).then(function (response) {
        return response.blob();
      }).then(function (blob) {
        var url = URL.createObjectURL(blob); // eslint-disable-line no-undef
        var scenarios = (0, _scenarios.changeScenarioScreenshotData)(_this6.state.scenarios, scenario, function (_ref6) {
          var savedScreenshots = _ref6.savedScreenshots;
          return {
            savedScreenshots: Object.assign([], savedScreenshots, _defineProperty({}, screenshotSizeIndex, {
              status: 'cached',
              url: url
            }))
          };
        });
        _this6.setState({ scenarios: scenarios });
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