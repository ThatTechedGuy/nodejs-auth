"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _handleEmailVerification = _interopRequireDefault(require("./handleEmailVerification"));

var _sendEmailConfirmation = _interopRequireDefault(require("./sendEmailConfirmation"));

var _sendPasswordReset = _interopRequireDefault(require("./sendPasswordReset"));

var _handlePasswordReset = _interopRequireDefault(require("./handlePasswordReset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var confirmation = {
  handleEmailVerification: _handleEmailVerification["default"],
  sendEmailConfirmation: _sendEmailConfirmation["default"],
  sendResetPasswordLink: _sendPasswordReset["default"],
  handlePasswordReset: _handlePasswordReset["default"]
};
var _default = confirmation;
exports["default"] = _default;