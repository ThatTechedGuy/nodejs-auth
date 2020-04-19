"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlePasswordSchema = exports.passwordConfirmationSchema = exports.emailVerificationSchema = exports.registerSchema = exports.otpSchema = exports.loginSchema = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loginSchema = _joi["default"].object({
  email: _joi["default"].string().trim().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }),
  password: _joi["default"].string().trim().min(7).max(150),
  token: [_joi["default"].string(), _joi["default"].number()]
}).xor('token', 'password').xor('token', 'email')["with"]('email', 'password');

exports.loginSchema = loginSchema;

var otpSchema = _joi["default"].object({
  OTP: _joi["default"].string().trim().alphanum().length(6).uppercase().required()
});

exports.otpSchema = otpSchema;

var registerSchema = _joi["default"].object({
  username: _joi["default"].string().trim().alphanum().min(3).max(30).required(),
  fullName: _joi["default"].string().trim().allow('').min(3).max(100).required(),
  email: _joi["default"].string().trim().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required(),
  password: _joi["default"].string().trim().min(7).max(150).required()
});

exports.registerSchema = registerSchema;

var emailVerificationSchema = _joi["default"].object({
  email: _joi["default"].string().trim().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }),
  username: _joi["default"].string().trim().alphanum().min(3).max(30)
}).xor('email', 'username');

exports.emailVerificationSchema = emailVerificationSchema;

var passwordConfirmationSchema = _joi["default"].object({
  email: _joi["default"].string().trim().email({
    minDomainSegments: 2,
    tlds: {
      allow: ['com', 'net']
    }
  }).required()
});

exports.passwordConfirmationSchema = passwordConfirmationSchema;

var handlePasswordSchema = _joi["default"].object({
  password: _joi["default"].string().trim().min(7).max(150).required(),
  password2: _joi["default"].ref('password'),
  OTP: _joi["default"].string().trim().alphanum().length(6).uppercase().required()
})["with"]('password', 'password2');

exports.handlePasswordSchema = handlePasswordSchema;