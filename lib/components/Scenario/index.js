'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Sidebar = require('../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _utils = require('../_lib/utils');

var _ScenarioNavLink = require('../../styled/ScenarioNavLink');

var _ScenarioNavLink2 = _interopRequireDefault(_ScenarioNavLink);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

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
 * Component which represents scenario node of the node tree in sidebar.
 * @extends React.Component
 * @property {ScenarioObject} props.node
 * @property {Object} props.selectedRoute - scenario and context name of selected route
 * @property {String} [props.searchQuery]
 * @property {Boolean} [props.child] - is the scenarios is inside a context
 */

var Scenario = function (_React$Component) {
  _inherits(Scenario, _React$Component);

  function Scenario() {
    _classCallCheck(this, Scenario);

    return _possibleConstructorReturn(this, (Scenario.__proto__ || Object.getPrototypeOf(Scenario)).apply(this, arguments));
  }

  _createClass(Scenario, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var name = this.props.node.name;
      var context = this.props.node.context;

      if ((0, _utils.isScenarioSelected)(this.props.selectedRoute, context, name) !== (0, _utils.isScenarioSelected)(nextProps.selectedRoute, context, name)) {
        return true;
      }

      if ((0, _utils.matchesQuery)(this.props.searchQuery, name) !== (0, _utils.matchesQuery)(nextProps.searchQuery, name)) {
        return true;
      }

      return this.props.node.hasDiff !== nextProps.node.hasDiff;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          searchQuery = _props.searchQuery,
          child = _props.child,
          _props$node = _props.node,
          name = _props$node.name,
          context = _props$node.context,
          hasDiff = _props$node.hasDiff,
          selectedRoute = _props.selectedRoute;

      var params = { context: context || 'null', scenario: name };

      var active = (0, _utils.isScenarioSelected)(selectedRoute, context, name);

      return (active || (0, _utils.matchesQuery)(searchQuery, name)) && _react2.default.createElement(
        _Sidebar2.default.ListItem,
        { key: name },
        _react2.default.createElement(
          _ScenarioNavLink2.default,
          {
            name: 'scenario',
            params: params,
            hasDiff: hasDiff,
            child: child,
            active: active
          },
          _react2.default.createElement(
            'span',
            { ref: function ref(_ref) {
                return _ref && active && _ref.scrollIntoViewIfNeeded && _ref.scrollIntoViewIfNeeded();
              } },
            name
          )
        )
      );
    }
  }]);

  return Scenario;
}(_react2.default.Component);

if (PropTypes) {
  Scenario.propTypes = {
    node: PropTypes.object.isRequired,
    searchQuery: PropTypes.string,
    child: PropTypes.bool,
    selectedRoute: PropTypes.object.isRequired
  };
}

exports.default = Scenario;