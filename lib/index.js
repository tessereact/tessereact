'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Testshot = exports.context = exports.scenario = exports.init = undefined;

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _Testshot = require('./Testshot');

var _Testshot2 = _interopRequireDefault(_Testshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Main entry point, exposes the public API

exports.init = _init2.default;
exports.scenario = _Testshot.scenario;
exports.context = _Testshot.context;
exports.Testshot = _Testshot2.default;