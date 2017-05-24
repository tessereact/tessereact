'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _flatten = require('lodash/flatten');
var clone = require('lodash/clone');
var merge = require('lodash/merge');
var isEmpty = require('lodash/isEmpty');
var isUndefined = require('lodash/isUndefined');

/**
 * RouterMatcher is a set of functions that helps to match routes.
 */
var RouterMatcher = {
  /**
   * Normalizes pathname.
   * @param {string} pathname
   *
   * @example
   *   RouterMatcher.normalize('/app/')
   *   //=> '/app'
   *   RouterMatcher.normalize('/app')
   *   //=> '/app'
   *   RouterMatcher.normalize('/')
   *   //=> '/'
   */
  normalize: function normalize(pathname) {
    if (pathname === '/') {
      return pathname;
    } else {
      return pathname.replace(/\/$/, '');
    }
  },


  /**
   * Joins pathnames.
   * @param {string[]} pathnames
   *
   * @example
   *   RouterMatcher.join(['/', 'app/', '/notifications/'])
   *   //=> '/app/notifications'
   */
  join: function join(pathnames) {
    var pathname = pathnames.join('/').replace(/\/{2,}/g, '/');
    return RouterMatcher.normalize(pathname);
  },


  /**
   * Makes routes object flat.
   * @param {Object} routes
   */
  flatten: function flatten(routes, basePath, baseProps) {
    var parentRouteName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    basePath = basePath || '';
    baseProps = baseProps || {};
    var flattenRoutes = _flatten(routes, true);
    var resultRoutes = flattenRoutes.reduce(function (flatRoutes, routeObj) {
      var flatRoutesFragment = void 0;
      var path = RouterMatcher.normalize(RouterMatcher.join([basePath, routeObj.path]));
      var props = merge(clone(baseProps), routeObj.props || {});

      if (routeObj.routes && !isEmpty(routeObj.routes)) {
        flatRoutesFragment = RouterMatcher.flatten(routeObj.routes, path, props, routeObj.name);
      } else {
        flatRoutesFragment = {};
      }

      if (routeObj.name) {
        flatRoutesFragment[routeObj.name] = { path: path, props: props };
        if (parentRouteName) {
          flatRoutesFragment[routeObj.name].parentRouteName = parentRouteName;
        }
      }

      return merge(clone(flatRoutes), flatRoutesFragment);
    }, {});

    // Matching aliases
    flattenRoutes.forEach(function (routeObj) {
      if (routeObj.alias) {
        resultRoutes[routeObj.alias].aliasPath = routeObj.path;
      }
    });

    return resultRoutes;
  },


  /**
   * Returns test object that contains regexp that matches passed path and
   * list of params.
   * @param {string} path
   */
  pathTestObject: function pathTestObject(path) {
    var paramsNames = [];
    var paramsCaptures = path.match(/:([^/|$]+)/g);
    if (paramsCaptures) {
      paramsNames = paramsCaptures.map(function (paramName) {
        return paramName.replace(/^:/, '');
      });
    }

    var regExp = new RegExp('^' + path.replace(/:[^/]+/g, '([^/]+)') + '$');

    return { regExp: regExp, paramsNames: paramsNames };
  },


  /**
   * @param {Object} route
   * @param {string} pathname
   */
  testPathnameForMatch: function testPathnameForMatch(route, pathname) {
    var testObj = RouterMatcher.pathTestObject(route.path);
    var paramsCaptures = pathname.match(testObj.regExp);

    if (!paramsCaptures && route.aliasPath) {
      testObj = RouterMatcher.pathTestObject(route.aliasPath);
      paramsCaptures = pathname.match(testObj.regExp);
    }

    if (!paramsCaptures) return;

    var params = {};
    paramsCaptures.slice(1).forEach(function (paramValue, index) {
      var paramName = testObj.paramsNames[index];
      params[paramName] = decodeURIComponent(paramValue);
    });
    return { pathname: pathname, params: params };
  },


  /**
   * @param {Object} routes - flat ones
   * @param {string} pathname
   */
  matchPathname: function matchPathname(routes, pathname) {
    var normalizedPathname = RouterMatcher.normalize(pathname);
    var routesNames = Object.keys(routes);
    var notFoundRoute = routes['not-found'];

    for (var index in routesNames) {
      var routeName = routesNames[index];
      var route = routes[routeName];
      var matchedRoute = RouterMatcher.testPathnameForMatch(route, normalizedPathname);

      if (matchedRoute) {
        return merge(matchedRoute, {
          route: merge(clone(route), { name: routeName })
        });
      }
    }

    return { pathname: pathname, params: {}, route: notFoundRoute };
  },


  /**
   * @param {Object} routes - flat ones
   * @param {string} path
   * @returns {Object} route data
   */
  matchPath: function matchPath(routes, path) {
    if (!path) return null;
    var pathObj = RouterMatcher.parsePath(path);
    var routeData = RouterMatcher.matchPathname(routes, pathObj.pathname);
    merge(routeData, pathObj, { searchParams: pathObj.params });
    return routeData;
  },


  /**
   * Parses search string (e.g 'wut=lol&lol=wut').
   * @param {string} search string
   * @returns {Object}
   */
  parseSearch: function parseSearch(search) {
    var searchObj = {};
    var searchPairs = search.replace(/^\?/, '').split('&');

    searchPairs.forEach(function (searchPop) {
      var hasEqualSign = /=/.test(searchPop);
      var searchPopArr = searchPop.split('=');
      var key = decodeURIComponent(searchPopArr[0]);
      var value = void 0;
      if (searchPopArr[1]) value = decodeURIComponent(searchPopArr[1]);

      if (isEmpty(key)) return;

      var preparedValue = void 0;
      if (isUndefined(value)) {
        preparedValue = hasEqualSign ? '' : true;
      } else if (value === 'true' || value === 'false') {
        preparedValue = value === 'true';
      } else if (parseInt(value).toString() === value) {
        preparedValue = parseInt(value);
      } else if (parseFloat(value).toString() === value) {
        preparedValue = parseFloat(value);
      } else {
        preparedValue = value;
      }

      searchObj[key] = preparedValue;
    });

    return searchObj;
  },


  /**
   * Parses path and search object.
   * @param {string} path
   * @returns {Object}
   */
  parsePath: function parsePath() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var pathArr = path.split('?');
    var pathname = RouterMatcher.normalize(pathArr[0]);
    var search = pathArr[1] ? '?' + pathArr[1] : '';
    var params = RouterMatcher.parseSearch(search);

    return { path: path, pathname: pathname, search: search, params: params };
  }
};

exports.default = RouterMatcher;