'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _forIn = require('lodash/forIn');

var _forIn2 = _interopRequireDefault(_forIn);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _memoize = require('lodash/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _matcher = require('./matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _history = require('./history');

var _history2 = _interopRequireDefault(_history);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Router
 *
 */
var Router = function () {
  /**
   * @constructor
   * Router constructor.
   * @param {routes} routes
   */
  function Router(routes) {
    _classCallCheck(this, Router);

    this.routes = _matcher2.default.flatten(routes);
  }

  /**
   * Handles onChange history event.
   * @param {string} path
   * @param {string} eventType, event caused route change (push, pop, replace
   * or synthetic)
   */


  _createClass(Router, [{
    key: 'onChange',
    value: function onChange(path, eventType) {
      var routeData = _matcher2.default.matchPath(this.routes, path);
      if ((0, _isFunction2.default)(this.cb)) {
        this.cb(routeData, eventType);
      }
    }

    /**
     * Starts history and watch for changes.
     * @param {Function} cb callback
     */

  }, {
    key: 'start',
    value: function start(cb) {
      this.cb = cb;
      _history2.default.start(this.onChange.bind(this));
    }

    /**
     * Stops history.
     */

  }, {
    key: 'stop',
    value: function stop() {
      _history2.default.stop();
    }

    /**
     * Navigates to given path.
     * @param {string} path
     */

  }, {
    key: 'navigateToPath',
    value: function navigateToPath(path) {
      _history2.default.push(path);
    }

    /**
     * Navigates to route.
     * @param {string} route name
     * @param {string} search params
     */

  }, {
    key: 'navigateToRoute',
    value: function navigateToRoute(route, params, search) {
      this.navigateToPath(this.hrefTo(route, params, search));
    }

    /**
     * Replaces history with given path.
     * @param {string} path
     */

  }, {
    key: 'replaceWithPath',
    value: function replaceWithPath(path) {
      _history2.default.replace(path);
    }

    /**
     * Replaces history with given route.
     * @param {string} route name
     * @param {string} search params
     */

  }, {
    key: 'replaceWithRoute',
    value: function replaceWithRoute(route, params, search) {
      this.replaceWithPath(this.hrefTo(route, params, search));
    }
  }, {
    key: 'replaceSearchQuery',
    value: function replaceSearchQuery(search) {
      var routeData = _matcher2.default.matchPath(this.routes, this.currentPath());
      search = (0, _merge2.default)(this.currentSearch(), search);
      this.replaceWithPath(this.hrefTo(routeData.route.name, routeData.params, search));
    }

    /**
     * Generates href for given route name and search params.
     * @param {string} name of route
     * @param {Object*} search params
     * @returns {string} path
     */

  }, {
    key: 'hrefTo',
    value: function hrefTo(name, params, search) {
      var route = void 0;

      if (!name) {
        var currentRoute = this.currentRoute();
        route = currentRoute.route;
        params = currentRoute.params;
      } else {
        route = this.routes[name];
      }

      if (!route) {
        throw new Error('"' + name + '" route is not defined');
      }

      var path = route.path;

      if (params) {
        path = path.replace(/:([^/]+)/gi, function (param, paramName) {
          if (!params[paramName]) {
            throw new Error('Missing params in "' + path + '"');
          }
          return params[paramName];
        });
      }

      if (search) {
        (function () {
          var searchArr = [];
          (0, _forIn2.default)(search, function (value, key) {
            value && searchArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
          });
          if (searchArr.length) {
            path += '?' + searchArr.join('&');
          }
        })();
      }

      return path;
    }

    /**
     * Returns true if passed route options match current path
     * @param {Object} options
     * @returns {Boolen}
     */

  }, {
    key: 'isCurrentPath',
    value: function isCurrentPath(options) {
      var path = void 0;
      if (options.path) {
        path = options.path;
      } else if (options.route) {
        path = this.hrefTo(options.route, options.params, options.search);
      }

      return path === this.currentPath();
    }
  }, {
    key: 'isPathMatchesRouteOrParents',
    value: function isPathMatchesRouteOrParents(path) {
      var currentRoute = this.currentRoute();
      var matchingRoute = _matcher2.default.matchPath(this.routes, path);

      if (!matchingRoute.route) {
        return false;
      }

      if (currentRoute && currentRoute.route) {
        var paramsMatch = Object.keys(matchingRoute.params).every(function (key) {
          return currentRoute.params[key] === matchingRoute.params[key];
        });

        if (currentRoute.route.name === matchingRoute.route.name && paramsMatch) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'isPathMatchesRouteOrParentsOrChildren',
    value: function isPathMatchesRouteOrParentsOrChildren(path) {
      var currentRoute = this.currentRoute();
      var matchingRoute = _matcher2.default.matchPath(this.routes, path);

      if (!matchingRoute.route) {
        return false;
      }

      if (currentRoute && currentRoute.route) {
        var paramsMatch = Object.keys(matchingRoute.params).every(function (key) {
          return currentRoute.params[key] === matchingRoute.params[key];
        });

        if (paramsMatch) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'currentRoute',
    value: function currentRoute() {
      var routeData = _matcher2.default.matchPath(this.routes, this.currentPath());
      if (routeData) {
        return routeData;
      } else {
        return null;
      }
    }

    /**
     * Returns current path.
     * @returns {boolean}
     */

  }, {
    key: 'currentPath',
    value: function currentPath() {
      return _history2.default.currentPath();
    }
  }, {
    key: 'currentSearch',
    value: function currentSearch() {
      var routeData = _matcher2.default.matchPath(this.routes, this.currentPath());
      return _matcher2.default.parseSearch(routeData.search);
    }
  }]);

  return Router;
}();

// Small cache for isPathMatchesRouteOrParents


Router.prototype.isPathMatchesRouteOrParents = (0, _memoize2.default)(Router.prototype.isPathMatchesRouteOrParents, function (path) {
  return [this.currentPath(), path].join('|');
});

exports.default = Router;