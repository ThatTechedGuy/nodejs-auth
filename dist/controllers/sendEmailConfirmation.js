"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validSchema = require("../services/validSchema");

var _emailVerification = require("../services/emailVerification");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var sendEmailConfirmation = function sendEmailConfirmation(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _emailVerificationSch, error, value, username, email, user;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Validatiing fields
              _emailVerificationSch = _validSchema.emailVerificationSchema.validate(req.body), error = _emailVerificationSch.error, value = _emailVerificationSch.value;

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
              username = value.username, email = value.email; // Checking for username or email

              if (!('username' in value)) {
                _context.next = 11;
                break;
              }

              _context.next = 8;
              return db.findOne({
                username: username
              });

            case 8:
              user = _context.sent;
              _context.next = 14;
              break;

            case 11:
              _context.next = 13;
              return db.findOne({
                email: email
              });

            case 13:
              user = _context.sent;

            case 14:
              if (user) {
                _context.next = 17;
                break;
              }

              res.status(400).json({
                success: false,
                message: 'Unknown username / email.'
              });
              return _context.abrupt("return");

            case 17:
              if (!(user.isConfirmed === true)) {
                _context.next = 20;
                break;
              }

              res.status(400).json({
                success: false,
                message: 'Email is already verified. Please login.'
              });
              return _context.abrupt("return");

            case 20:
              // Send a verification email to user.
              (0, _emailVerification.sendEmailVerification)(user.email); // Success

              res.status(200).json({
                success: true,
                message: 'Email confirmation sent'
              });

            case 22:
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

var _default = sendEmailConfirmation;
exports["default"] = _default;