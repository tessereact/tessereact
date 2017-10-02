'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require('./lib/router/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _router2.default([{
  path: '/',
  name: 'home',
  routes: [{
    path: '/demo',
    name: 'demo'
  }, {
    path: '/contexts/:context',
    name: 'context',
    routes: [{
      path: '/scenarios/:scenario',
      name: 'scenario',
      routes: [{
        path: '/view',
        name: 'view'
      }]
    }]
  }]
}]);