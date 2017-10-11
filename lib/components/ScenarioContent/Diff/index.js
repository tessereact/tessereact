'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _diff = require('../../_lib/diff');

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
 * Renders diff of a scenario.
 * @extends React.Component
 * @property {ScenarioObject} props.scenario
 * @property {'html'|'css'} props.type
 * @property {Boolean} [props.sideBySide]
 */

var Diff = function (_React$Component) {
  _inherits(Diff, _React$Component);

  function Diff() {
    _classCallCheck(this, Diff);

    return _possibleConstructorReturn(this, (Diff.__proto__ || Object.getPrototypeOf(Diff)).apply(this, arguments));
  }

  _createClass(Diff, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _props = this.props,
          scenario = _props.scenario,
          type = _props.type;
      var nextScenario = nextProps.scenario,
          nextType = nextProps.type;


      return type !== nextType || scenario.context !== nextScenario.context || scenario.name !== nextScenario.name;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          scenario = _props2.scenario,
          type = _props2.type,
          sideBySide = _props2.sideBySide;


      var options = { sideBySide: sideBySide };

      var diff = type === 'css' ? (0, _diff.getCSSDiff)(scenario, options) : (0, _diff.getHTMLDiff)(scenario, options);

      if (!diff) {
        return null;
      }

      return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: diff } });
    }
  }]);

  return Diff;
}(_react2.default.Component);

if (PropTypes) {
  Diff.propTypes = {
    scenario: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    sideBySide: PropTypes.bool
  };
}

exports.default = Diff;