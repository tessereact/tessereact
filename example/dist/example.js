require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _testshot = require('testshot');

var _testshot2 = _interopRequireDefault(_testshot);

var Service = _react2['default'].createClass({
  displayName: 'Service',

  render: function render() {
    return _react2['default'].createElement(
      'p',
      { className: this.props.selected ? 'active' : '', onClick: this.props.onClick },
      this.props.name,
      ' ',
      _react2['default'].createElement(
        'b',
        null,
        '$ ',
        this.props.price.toFixed(2)
      )
    );
  }
});

exports.Service = Service;
var Cart = _react2['default'].createClass({
  displayName: 'Cart',

  getInitialState: function getInitialState() {
    return {
      items: this.props.items,
      total: this.props.items.filter(function (i) {
        return i.selected;
      }).map(function (i) {
        return i.price;
      }).reduce(function (x, i) {
        return x + i;
      }, 0)
    };
  },

  addTotal: function addTotal(service) {
    var items = this.state.items.slice(0);
    items.forEach(function (i) {
      if (i.name == service.name) {
        i.selected = !service.selected;
      }
    });
    if (!service.selected) {
      this.setState({ items: items, total: this.state.total - service.price });
    } else {
      this.setState({ items: items, total: this.state.total + service.price });
    }
  },

  render: function render() {
    var services = this.props.items.map((function (s, i) {
      return _react2['default'].createElement(Service, {
        key: i,
        name: s.name,
        price: s.price,
        selected: s.selected,
        onClick: this.addTotal.bind(this, s)
      });
    }).bind(this));

    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement(
        'h1',
        null,
        'Our Services'
      ),
      _react2['default'].createElement(
        'div',
        { id: 'services' },
        services,
        _react2['default'].createElement(
          'p',
          { id: 'total' },
          'Total ',
          _react2['default'].createElement(
            'b',
            null,
            '$',
            this.state.total.toFixed(2)
          )
        )
      )
    );
  }
});

var App = _react2['default'].createClass({
  displayName: 'App',

  render: function render() {
    var services = [{ name: 'Web Development', price: 300 }, { name: 'Design', price: 400 }, { name: 'Integration', price: 250 }, { name: 'Training', price: 220 }];

    return _react2['default'].createElement(Cart, { items: services });
  }
});

// TODO: Move to snapshots.js file
(0, _testshot.scenario)('Service: Basic', function () {
  return _react2['default'].createElement(Service, { name: 'UI Design', price: 332 });
});

(0, _testshot.scenario)('Cart: With a service', function () {
  var services = [{ name: 'Web Development', price: 300, selected: false }, { name: 'Design', price: 400 }, { name: 'Integration', price: 250 }, { name: 'New service', price: 120 }];

  return _react2['default'].createElement(Cart, { items: services });
});

_reactDom2['default'].render(_react2['default'].createElement(
  _testshot2['default'],
  { server: { host: 'localhost', port: '3001' } },
  _react2['default'].createElement(App, null)
), document.getElementById('app'));

},{"react":undefined,"react-dom":undefined,"testshot":undefined}]},{},[1]);
