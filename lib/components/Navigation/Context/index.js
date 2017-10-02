'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _List = require('../List');

var _List2 = _interopRequireDefault(_List);

var _Sidebar = require('../../../styled/Sidebar');

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _Arrow = require('../../../styled/Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _ContextNavLink = require('../../../styled/ContextNavLink');

var _ContextNavLink2 = _interopRequireDefault(_ContextNavLink);

var _utils = require('../../_lib/utils');

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
 * Component which represents context node of the node tree in sidebar.
 * @extends React.Component
 * @property {ContextObject} props.node
 * @property {Object} props.selectedRoute - name of selected route, and if available, selected scenario and context
 * @property {String} [props.searchQuery]
 */

var Context = function (_React$Component) {
  _inherits(Context, _React$Component);

  function Context() {
    _classCallCheck(this, Context);

    return _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).apply(this, arguments));
  }

  _createClass(Context, [{
    key: '_hasFailingChildren',
    value: function _hasFailingChildren() {
      return this.props.node.children.find(function (_ref) {
        var hasDiff = _ref.hasDiff;
        return hasDiff;
      });
    }
  }, {
    key: '_shouldExpand',
    value: function _shouldExpand() {
      return this._hasFailingChildren() || this._applyFilter() && this._searchMatchChildren();
    }
  }, {
    key: '_applyFilter',
    value: function _applyFilter() {
      return this.props.searchQuery.length >= _utils.SEARCH_LIMIT;
    }
  }, {
    key: '_matchFilter',
    value: function _matchFilter() {
      return (0, _utils.matchesQuery)(this.props.searchQuery, this.props.node.name);
    }
  }, {
    key: '_searchMatchChildren',
    value: function _searchMatchChildren() {
      var _this2 = this;

      return (0, _some3.default)(this.props.node.children, function (child) {
        return (0, _utils.matchesQuery)(_this2.props.searchQuery, child.name);
      });
    }
  }, {
    key: '_renderIcon',
    value: function _renderIcon() {
      return this._shouldExpand() ? _react2.default.createElement(_Arrow2.default.Down, null) : _react2.default.createElement(_Arrow2.default.Right, null);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var selectedRoute = this.props.selectedRoute;
      var _props$node = this.props.node,
          name = _props$node.name,
          children = _props$node.children;

      // If context's name matches filter, render all children.
      // Otherwise, filter them by query or selected

      var filteredChildren = this._matchFilter() ? children : children.filter(function (scenario) {
        return (0, _utils.matchesQuery)(_this3.props.searchQuery, scenario.name) || (0, _utils.isScenarioSelected)(selectedRoute, name, scenario.name);
      });

      var hasSelectedChildren = (0, _utils.areContextChildrenSelected)(selectedRoute, name);
      var active = (0, _utils.isContextSelected)(selectedRoute, name);

      return (hasSelectedChildren || filteredChildren.length > 0) && _react2.default.createElement(
        _Sidebar2.default.ListItem,
        { key: name },
        _react2.default.createElement(
          _ContextNavLink2.default,
          {
            name: 'context',
            params: { context: name },
            active: active
          },
          this._renderIcon(),
          _react2.default.createElement(
            'span',
            { ref: function ref(_ref2) {
                return _ref2 && active && _ref2.scrollIntoViewIfNeeded && _ref2.scrollIntoViewIfNeeded();
              } },
            name
          )
        ),
        (active || hasSelectedChildren || this._shouldExpand()) && _react2.default.createElement(_List2.default, { nodes: filteredChildren, selectedRoute: selectedRoute, child: true })
      );
    }
  }]);

  return Context;
}(_react2.default.Component);

if (PropTypes) {
  Context.propTypes = {
    node: PropTypes.object.isRequired,
    searchQuery: PropTypes.string,
    selectedRoute: PropTypes.object.isRequired
  };
}

exports.default = Context;