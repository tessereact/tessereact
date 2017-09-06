'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _Testshot = require('./Testshot');

var _Testshot2 = _interopRequireDefault(_Testshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main entry point, exposes the public API

var T = {
  init: _init2.default,
  scenario: _Testshot.scenario,
  context: _Testshot.context,
  Testshot: _Testshot2.default
};

exports.default = T;