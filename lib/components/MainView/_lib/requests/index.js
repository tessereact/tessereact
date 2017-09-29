'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJSON = getJSON;
exports.postJSON = postJSON;

var _mockServer = require('../mockServer');

var _mockServer2 = _interopRequireDefault(_mockServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch url with method GET.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response
 */
function getJSON(url) {
  if (window.__tessereactDemoMode) {
    return Promise.resolve((0, _mockServer2.default)(url, { method: 'GET' }));
  }

  return window.fetch(url, {
    method: 'GET',
    mode: 'cors'
  });
}

/**
 * Fetch url with method POST and with the given request body.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response
 */
function postJSON(url, body) {
  if (window.__tessereactDemoMode) {
    return Promise.resolve((0, _mockServer2.default)(url, { method: 'POST', body: body }));
  }

  return window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  });
}