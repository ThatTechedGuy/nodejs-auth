"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ioredis = _interopRequireDefault(require("ioredis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var redis = new _ioredis["default"](process.env.REDIS_URL);
var _default = redis;
exports["default"] = _default;