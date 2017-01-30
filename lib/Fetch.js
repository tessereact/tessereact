'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postJSON = postJSON;
function postJSON(url, body) {
  return window.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  });
}