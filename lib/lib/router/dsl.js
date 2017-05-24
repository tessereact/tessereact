'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var cloneDeep = require('lodash/cloneDeep');
var flatten = require('lodash/flatten');
var merge = require('lodash/merge');
var pick = require('lodash/pick');
var omit = require('lodash/omit');

/**
 * DSL generates structure that can understand router matcher.
 */
var RouterDSL = {
  /**
   * @param {Object} options
   * @param {Object[]} routes
   */
  routes: function routes(options) {
    var routesData = RouterDSL.extractProps(options);
    var routes = flatten(Array.prototype.slice.call(arguments, 1), true);
    return routes.map(function (route) {
      return merge(cloneDeep(routesData), route);
    });
  },


  /**
   * @param {Object} options
   * @param {Object[]} nestedRoutes
   */
  route: function route(options) {
    options = options || {};
    var nestedRoutes = Array.prototype.slice.call(arguments, 1);
    return merge({ nestedRoutes: nestedRoutes }, RouterDSL.extractProps(options));
  },


  /**
   * @param {Object} options
   */
  extractProps: function extractProps(options) {
    var extracted = pick(options, ['name', 'path']);
    extracted.props = omit(options, ['name', 'path']);
    return extracted;
  }
};

exports.default = RouterDSL;