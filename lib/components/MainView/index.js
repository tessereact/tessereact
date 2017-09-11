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

var _prepareStyles = require('./_lib/prepareStyles');

var _prepareStyles2 = _interopRequireDefault(_prepareStyles);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {}
// Ignore optional peer dependency


// styled components


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
   * Load snapshots from the server
   */


  _createClass(MainView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var routeData = this.props.routeData;

      var url = '//' + this.props.host + ':' + this.props.port + '/snapshots-list';

      (0, _onLoad2.default)().then(function () {
        var scenarios = _this2.state.scenarios;


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
          }))
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
     * Render UI element, which contains header, scenario and diffs.
     * Represents selected scenario.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderScenario',
    value: function _renderScenario(scenario) {
      var _this3 = this;

      if (!scenario) return null;
      return _react2.default.createElement(
        _Content2.default.Wrapper,
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
                  return _this3._acceptSnapshot(scenario);
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
        var url = URL.createObjectURL(blob); // eslint-disable-line no-undef
        var scenarios = (0, _scenarios.changeScenarioScreenshotData)(_this6.state.scenarios, scenario, function (_ref4) {
          var savedScreenshots = _ref4.savedScreenshots;
          return {
            savedScreenshots: Object.assign([], savedScreenshots, _defineProperty({}, screenshotSizeIndex, url))
          };
        });
        _this6.setState({ scenarios: scenarios });
      });
    }

    /**
     * Render diff of a scenario if it exists.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderDiff',
    value: function _renderDiff(scenario) {
      if (scenario.hasDiff) {
        return scenario.diff;
      }
    }

    /**
     * Render screenshot header and diff of the scenario.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderScreenshotData',
    value: function _renderScreenshotData(scenario) {
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
                  selected: index === selectedScreenshotSizeIndex
                },
                alias || width + ' \xD7 ' + height
              );
            })
          )
        ),
        this._renderScreenshot(screenshotSizes, savedScreenshots, selectedScreenshotSizeIndex)
      );
    }

    /**
     * Render the selected screenshot if it is cached.
     * @param {Array<Object>} screenshotSizes
     * @param {Array<String>} savedScreenshots
     * @param {Number} selectedScreenshotSizeIndex
     */

  }, {
    key: '_renderScreenshot',
    value: function _renderScreenshot(screenshotSizes, savedScreenshots, index) {
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