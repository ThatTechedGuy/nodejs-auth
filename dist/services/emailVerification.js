"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmailVerification = void 0;

var _store = _interopRequireDefault(require("./store"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _otp = _interopRequireDefault(require("./otp"));

var _sendMail = _interopRequireDefault(require("./sendMail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sendEmailVerification = function sendEmailVerification(email) {
  var OTP = (0, _otp["default"])();

  var emailToken = _jsonwebtoken["default"].sign({
    email: email,
    OTP: OTP
  }, // payload
  process.env.JWT_MAIL_SECRET, //secret
  {
    expiresIn: "2 days"
  } //expiration
  );

  var subject = "Mealtimify Email Verification Link";
  var text = "Please use this One Time Password in the app to complete the verification: ".concat(OTP);

  _store["default"].set(OTP, emailToken);

  (0, _sendMail["default"])(email, subject, text);
};

exports.sendEmailVerification = sendEmailVerification;