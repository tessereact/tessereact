'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _FilterInput = require('../../styled/FilterInput');

var _FilterInput2 = _interopRequireDefault(_FilterInput);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _link = require('../../lib/link');

var _link2 = _interopRequireDefault(_link);

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
 * Component which represents the sidebar element of Tessereact UI.
 * @extends React.Component
 * @property {Array<ContextObject|ScenarioObject>} props.nodes - tree of contexts and scenarios
 * @property {Number} props.scenariosCount - total number of scenarios created by user
 * @property {Number} props.loadedScenariosCount - number of scenarios sent by the server
 * @property {Number} props.failedScenariosCount - number of scenarios that have diff
 */

var Navigation = function (_React$Component) {
  _inherits(Navigation, _React$Component);

  function Navigation(props, context) {
    _classCallCheck(this, Navigation);

    var _this = _possibleConstructorReturn(this, (Navigation.__proto__ || Object.getPrototypeOf(Navigation)).call(this, props, context));

    _this.state = {
      searchQuery: ''
    };
    return _this;
  }

  _createClass(Navigation, [{
    key: '_handleFilter',
    value: function _handleFilter(event) {
      this.setState({ searchQuery: event.target.value });
    }
  }, {
    key: '_renderLoading',
    value: function _renderLoading() {
      var _props = this.props,
          loadedScenariosCount = _props.loadedScenariosCount,
          scenariosCount = _props.scenariosCount;


      return loadedScenariosCount !== scenariosCount && _react2.default.createElement(
        _Sidebar2.default.Progress,
        null,
        'LOADING (',
        loadedScenariosCount,
        '/',
        scenariosCount,
        ')'
      );
    }
  }, {
    key: '_renderFailed',
    value: function _renderFailed() {
      var _props2 = this.props,
          failedScenariosCount = _props2.failedScenariosCount,
          loadedScenariosCount = _props2.loadedScenariosCount,
          scenariosCount = _props2.scenariosCount;

      var showFailed = loadedScenariosCount === scenariosCount && failedScenariosCount > 0;

      return showFailed && _react2.default.createElement(
        _Sidebar2.default.Progress,
        null,
        'FAILED (',
        failedScenariosCount,
        '/',
        scenariosCount,
        ')'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var searchQuery = this.state.searchQuery;
      var nodes = this.props.nodes;


      return _react2.default.createElement(
        _Sidebar2.default,
        null,
        _react2.default.createElement(
          _link2.default,
          { name: 'home', style: { textDecoration: 'none' } },
          _react2.default.createElement(
            _Sidebar2.default.Header,
            null,
            'Testshot'
          )
        ),
        _react2.default.createElement(
          _Sidebar2.default.SearchBox,
          null,
          _react2.default.createElement(_FilterInput2.default, { placeholder: 'Search', ref: searchQuery, onChange: this._handleFilter.bind(this) })
        ),
        _react2.default.createElement(
          _Sidebar2.default.List,
          null,
          this._renderLoading(),
          this._renderFailed(),
          _react2.default.createElement(_List2.default, {
            nodes: nodes,
            searchQuery: searchQuery
          })
        )
      );
    }
  }]);

  return Navigation;
}(_react2.default.Component);

if (PropTypes) {
  Navigation.propTypes = {
    loadedScenariosCount: PropTypes.number.isRequired,
    failedScenariosCount: PropTypes.number.isRequired,
    scenariosCount: PropTypes.number.isRequired,
    nodes: PropTypes.array.isRequired
  };
}

exports.default = Navigation;