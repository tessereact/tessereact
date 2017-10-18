'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _onLoad = require('../_lib/onLoad');

var _onLoad2 = _interopRequireDefault(_onLoad);

var _styles = require('../_lib/styles');

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
 * Component which renders all scenarios with styles needed to be fetched.
 * Also fetches them.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 */

var FetchCSSView = function (_React$Component) {
  _inherits(FetchCSSView, _React$Component);

  function FetchCSSView() {
    _classCallCheck(this, FetchCSSView);

    return _possibleConstructorReturn(this, (FetchCSSView.__proto__ || Object.getPrototypeOf(FetchCSSView)).apply(this, arguments));
  }

  _createClass(FetchCSSView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      (0, _onLoad2.default)().then(function () {
        var styles = (0, _styles.prepareStyles)(document.styleSheets);
        var scenariosToFetch = _this2.props.data.filter(function (_ref) {
          var css = _ref.options.css;
          return css;
        });
        var scenarios = scenariosToFetch.map(function (scenario) {
          return {
            name: scenario.name,
            context: scenario.context,
            snapshotCSS: (0, _styles.buildSnapshotCSS)(styles, document.getElementById((0, _styles.generateScenarioId)(scenario)), document.documentElement, document.body)
          };
        });

        var search = window.location.search.slice(1);

        var _queryString$parse = _qs2.default.parse(search),
            wsPort = _queryString$parse.wsPort;

        if (wsPort) {
          (function () {
            var ws = new window.WebSocket('ws://localhost:' + wsPort);
            ws.addEventListener('open', function () {
              ws.send(JSON.stringify({ scenarios: scenarios }));
            });
          })();
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var scenarios = this.props.data.filter(function (_ref2) {
        var css = _ref2.options.css;
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
  }]);

  return FetchCSSView;
}(_react2.default.Component);

if (PropTypes) {
  FetchCSSView.propTypes = {
    data: PropTypes.array.isRequired
  };
}

exports.default = FetchCSSView;