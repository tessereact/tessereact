'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Header = require('../../styled/Header');

var _Header2 = _interopRequireDefault(_Header);

var _Content = require('../../styled/Content');

var _Content2 = _interopRequireDefault(_Content);

var _ComponentPreview = require('../../styled/ComponentPreview');

var _ComponentPreview2 = _interopRequireDefault(_ComponentPreview);

var _AcceptButton = require('../../styled/AcceptButton');

var _AcceptButton2 = _interopRequireDefault(_AcceptButton);

var _Button = require('../../styled/Button');

var _Button2 = _interopRequireDefault(_Button);

var _SmallButton = require('../../styled/SmallButton');

var _SmallButton2 = _interopRequireDefault(_SmallButton);

var _ScenarioFrame = require('./ScenarioFrame');

var _ScenarioFrame2 = _interopRequireDefault(_ScenarioFrame);

var _PanelGroup = require('./PanelGroup');

var _PanelGroup2 = _interopRequireDefault(_PanelGroup);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = void 0;
try {
  PropTypes = require('prop-types');
} catch (e) {}
// Ignore optional peer dependency


/**
 * UI element, which contains header, scenario and diffs.
 * Represents selected scenario.
 * @extends React.Component
 * @property {ScenarioObject} props.scenario - list of scenarios created by user
 * @property {Function} props.onAcceptSnapshot
 * @property {Function} props.onRequestScreenshot
 */

var ScenarioContent = function (_React$Component) {
  _inherits(ScenarioContent, _React$Component);

  function ScenarioContent(props, context) {
    _classCallCheck(this, ScenarioContent);

    var _this = _possibleConstructorReturn(this, (ScenarioContent.__proto__ || Object.getPrototypeOf(ScenarioContent)).call(this, props, context));

    _this.state = {
      tab: 'component',
      twoColumns: true,
      resizing: false
    };
    return _this;
  }

  _createClass(ScenarioContent, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.scenario.name !== nextProps.scenario.name || this.props.scenario.context !== nextProps.scenario.context) {
        this.setState({ tab: 'component' });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var scenario = this.props.scenario;
      var _state = this.state,
          tab = _state.tab,
          twoColumns = _state.twoColumns;


      if (scenario.hasDiff && twoColumns) {
        return this._renderTwoColumns(scenario);
      } else {
        return this._renderSingleColumn(scenario, tab);
      }
    }
  }, {
    key: '_renderTwoColumns',
    value: function _renderTwoColumns(scenario) {
      var _this2 = this;

      var onAcceptSnapshot = this.props.onAcceptSnapshot;


      return _react2.default.createElement(
        _Content2.default.Wrapper,
        null,
        _react2.default.createElement(
          _Header2.default,
          null,
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'span',
              null,
              scenario.name
            )
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
              { onClick: onAcceptSnapshot },
              'Accept & next'
            )
          )
        ),
        _react2.default.createElement(
          _PanelGroup2.default,
          {
            onStartResizing: function onStartResizing() {
              return _this2.setState({ resizing: true });
            },
            onStopResizing: function onStopResizing() {
              return _this2.setState({ resizing: false });
            },
            panelWidths: [{ minSize: 100 }, { minSize: 400, size: 500 }]
          },
          _react2.default.createElement(
            _ComponentPreview2.default.LeftPane,
            null,
            _react2.default.createElement(
              _ComponentPreview2.default,
              null,
              this._renderContent(scenario, this.state.resizing ? 'resizingComponent' : 'component')
            )
          ),
          _react2.default.createElement(
            _ComponentPreview2.default.RightPane,
            null,
            _react2.default.createElement(
              _ComponentPreview2.default,
              null,
              this._renderContent(scenario, 'screenshot'),
              this._renderContent(scenario, 'html'),
              this._renderContent(scenario, 'css')
            )
          )
        )
      );
    }
  }, {
    key: '_renderSingleColumn',
    value: function _renderSingleColumn(scenario, tab) {
      var _this3 = this;

      var onAcceptSnapshot = this.props.onAcceptSnapshot;


      return _react2.default.createElement(
        _Content2.default.Wrapper,
        null,
        _react2.default.createElement(
          _Header2.default,
          null,
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'span',
              null,
              scenario.name
            ),
            scenario.hasDiff && _react2.default.createElement(
              _Button2.default,
              { selected: false, onClick: this._toggleTwoColumns.bind(this) },
              'Two column mode'
            ),
            scenario.hasDiff && _react2.default.createElement(
              _Button2.default,
              { selected: tab === 'component', onClick: function onClick() {
                  return _this3.setState({ tab: 'component' });
                } },
              'Component'
            ),
            scenario.diff && _react2.default.createElement(
              _Button2.default,
              { selected: tab === 'html', onClick: function onClick() {
                  return _this3.setState({ tab: 'html' });
                } },
              'HTML'
            ),
            scenario.diffCSS && _react2.default.createElement(
              _Button2.default,
              { selected: tab === 'css', onClick: function onClick() {
                  return _this3.setState({ tab: 'css' });
                } },
              'CSS'
            ),
            scenario.screenshotData && _react2.default.createElement(
              _Button2.default,
              { selected: tab === 'screenshot', onClick: function onClick() {
                  return _this3.setState({ tab: 'screenshot' });
                } },
              'Screenshot'
            )
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
              { onClick: onAcceptSnapshot },
              'Accept & next'
            )
          )
        ),
        _react2.default.createElement(
          _ComponentPreview2.default,
          null,
          this._renderContent(scenario, this.state.tab)
        )
      );
    }

    /**
     * Render an entity (tab) of the scenario.
     * @param {ScenarioObject} scenario
     * @param {'html'|'css'|'screenshot'|'component'|'resizingComponent'} tab
     */

  }, {
    key: '_renderContent',
    value: function _renderContent(scenario, tab) {
      switch (tab) {
        case 'html':
          return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this._renderDiff(scenario.diff) } });
        case 'css':
          return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: this._renderDiff(scenario.diffCSS) } });
        case 'screenshot':
          return this._renderScreenshotData(scenario);
        case 'resizingComponent':
        case 'component':
        default:
          return _react2.default.createElement(
            'div',
            { className: 'component-iframe_container' },
            tab === 'resizingComponent' && _react2.default.createElement('div', { className: 'component-iframe_overlay' }),
            _react2.default.createElement(_ScenarioFrame2.default, { className: 'component-iframe', context: scenario.context, name: scenario.name })
          );
      }
    }

    /**
     * Render diff if it not null.
     * @param {String} diff
     */

  }, {
    key: '_renderDiff',
    value: function _renderDiff(diff) {
      if (diff) {
        return diff;
      }
    }

    /**
     * Render screenshot header and diff of the scenario.
     * @param {ScenarioObject} scenario
     */

  }, {
    key: '_renderScreenshotData',
    value: function _renderScreenshotData(scenario) {
      var screenshotData = scenario.screenshotData;
      var onRequestScreenshot = this.props.onRequestScreenshot;


      if (!screenshotData || !screenshotData.before || !screenshotData.after) {
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
              'Visual Diff'
            ),
            screenshotSizes.map(function (_ref, index) {
              var alias = _ref.alias,
                  width = _ref.width,
                  height = _ref.height;
              return _react2.default.createElement(
                _SmallButton2.default,
                {
                  key: index,
                  onClick: function onClick() {
                    return onRequestScreenshot(index);
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

      if (!savedScreenshots || !savedScreenshots[index] || savedScreenshots[index].status === 'loading') {
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
        _react2.default.createElement('img', { style: { height: height, width: width, minWidth: width }, src: savedScreenshots[index].url })
      );
    }
  }, {
    key: '_toggleTwoColumns',
    value: function _toggleTwoColumns() {
      this.setState({ twoColumns: !this.state.twoColumns });
    }
  }]);

  return ScenarioContent;
}(_react2.default.Component);

if (PropTypes) {
  ScenarioContent.propTypes = {
    scenario: PropTypes.object.isRequired,
    onAcceptSnapshot: PropTypes.func.isRequired,
    onRequestScreenshot: PropTypes.func.isRequired
  };
}

exports.default = ScenarioContent;