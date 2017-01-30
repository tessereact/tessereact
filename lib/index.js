'use strict';

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _Testshot = require('./Testshot');

var _Testshot2 = _interopRequireDefault(_Testshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main entry point, exposes the public API

module.exports = {
  init: _init2.default,
  scenario: _Testshot.scenario,
  Testshot: _Testshot2.default
};