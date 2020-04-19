"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cryptoRandomString = _interopRequireDefault(require("crypto-random-string"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Generates random 6 digit OTP
var generateOTP = function generateOTP() {
  return (0, _cryptoRandomString["default"])({
    length: 6,
    type: 'distinguishable'
  });
};

var _default = generateOTP;
exports["default"] = _default;