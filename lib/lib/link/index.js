'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

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
 * Component which renders a single-page application style link to a route.
 * @extends React.Component
 * @property {String} props.name - name of the route
 * @property {Object} props.params - search params of the route
 * @property {Node} props.children - children nodes of the element
 * @property {String} [props.className] - CSS class name of the resulting element
 * @property {React.Component | String} [component='a'] - component to base the link on
 */

var Link = function (_Component) {
  _inherits(Link, _Component);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
  }

  _createClass(Link, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          name = _props.name,
          params = _props.params,
          children = _props.children,
          component = _props.component;


      return (0, _react.createElement)(component || 'a', {
        className: className,
        onClick: function onClick(e) {
          e.preventDefault();
          _routes2.default.navigateToRoute(name, params);
        }
      }, children);
    }
  }]);

  return Link;
}(_react.Component);

if (PropTypes) {
  Link.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    params: PropTypes.object,
    children: PropTypes.node
  };
}

exports.default = Link;