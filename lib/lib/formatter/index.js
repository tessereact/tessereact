'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsBeautify = require('js-beautify');

var htmlFormatterOptions = {
  indent_size: 2,
  end_with_newline: true,
  unformatted: ['b', 'i', 'strong']
};

var formatHTML = function formatHTML(str) {
  return str ? (0, _jsBeautify.html)(str, htmlFormatterOptions) : '';
};

exports.default = formatHTML;