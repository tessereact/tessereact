'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var location = window.location;
var addEventListener = window.addEventListener.bind(window);
var removeEventListener = window.removeEventListener.bind(window);
var pushState = window.history.pushState.bind(window.history);
var replaceState = window.history.replaceState.bind(window.history);

var onChange = void 0;

/**
 * Set of functions that helps to manipulate browser history.
 */
var RouterHistory = {
  /**
   * Push state with given path.
   * @param {string} path
   */
  push: function push(path) {
    pushState(null, null, path);
    onChange(path, 'push');
  },


  /**
   * Replace state with given path.
   * @param {string} path
   */
  replace: function replace(path) {
    replaceState(null, null, path);
    onChange(path, 'replace');
  },


  /**
   * popstate listener.
   */
  onPopState: function onPopState(e) {
    onChange(RouterHistory.currentPath(), typeof e === 'undefined' ? 'synthetic' : 'pop');
  },


  /**
   * @param {Function} cb callback
   * @returns {Function} that removes event listener.
   */
  start: function start(cb) {
    onChange = cb;
    addEventListener('popstate', RouterHistory.onPopState);
    RouterHistory.onPopState();
  },


  /**
   * Removes history listener
   */
  stop: function stop() {
    onChange = undefined;
    removeEventListener('popstate', RouterHistory.onPopState);
  },


  /**
   * @returns {string} current path
   */
  currentPath: function currentPath() {
    return location.pathname + location.search;
  }
};

exports.default = RouterHistory;