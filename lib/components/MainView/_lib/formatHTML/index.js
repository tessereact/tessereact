'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatHTML;

var _jsBeautify = require('js-beautify');

var htmlFormatterOptions = {
  indent_size: 2,
  end_with_newline: true,
  unformatted: ['b', 'i', 'strong']
};

/**
 * Indent the provided HTML string.
 *
 * @param {String} str - unindented HTML
 * @returns {String} - indented HTML
 */
function formatHTML(str) {
  return str ? (0, _jsBeautify.html)(str, htmlFormatterOptions) : '';
}