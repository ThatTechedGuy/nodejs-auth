"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _store = _interopRequireDefault(require("./../services/store"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _otp = _interopRequireDefault(require("./../services/otp"));

var _validSchema = require("../services/validSchema");

var _sendMail = _interopRequireDefault(require("./../services/sendMail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sendResetPasswordLink = function sendResetPasswordLink(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _passwordConfirmation, error, value, email, user, OTP, passwordToken, subject, text;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Validating the request body
              _passwordConfirmation = _validSchema.passwordConfirmationSchema.validate(req.body), error = _passwordConfirmation.error, value = _passwordConfirmation.value;

              if (!(error !== undefined)) {
                _context.next = 4;
                break;
              }

              res.status(401).json({
                success: false,
                message: error.message
              });
              return _context.abrupt("return");

            case 4:
              email = value.email; // Checking if the user email exists

              user = db.findOne({
                email: email
              });

              if (user) {
                _context.next = 9;
                break;
              }

              res.status(400).json({
                success: false,
                message: 'Unknown email.'
              });
              return _context.abrupt("return");

            case 9:
              // Send password change link through email.
              OTP = (0, _otp["default"])();
              passwordToken = _jsonwebtoken["default"].sign({
                email: email,
                OTP: OTP
              }, process.env.JWT_PASSWORD_RESET_SECRET, {
                expiresIn: '24h'
              });
              subject = 'Mealtimify Reset Password Link';
              text = "Please paste this One Time Password in the app to set a new password: ".concat(OTP); // Storing the OTP

              _store["default"].set(OTP, passwordToken); // Send mail


              (0, _sendMail["default"])(email, subject, text); // Success

              res.status(200).json({
                success: true,
                message: 'Password OTP sent'
              });

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var _default = sendResetPasswordLink;
exports["default"] = _default;