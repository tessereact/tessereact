'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onLoad;
/**
 * @returns {Promise} promise, resolved when document is fully loaded.
 */
function onLoad() {
  return new Promise(function (resolve, reject) {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}