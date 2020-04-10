"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _store = _interopRequireDefault(require("./../services/store"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _validSchema = require("../services/validSchema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var handleEmailVerification = function handleEmailVerification(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _otpSchema$validate, error, token, _jwt$verify, email, OTP, user;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Validate incoming request
              _otpSchema$validate = _validSchema.otpSchema.validate(req.body), error = _otpSchema$validate.error;

              if (!(error !== undefined)) {
                _context.next = 4;
                break;
              }

              // Validation failed
              res.status(401).json({
                success: false,
                message: error.message
              });
              return _context.abrupt("return");

            case 4:
              _context.prev = 4;
              _context.next = 7;
              return _store["default"].get(req.body.OTP);

            case 7:
              token = _context.sent;
              _context.next = 15;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](4);
              console.log(_context.t0.message);
              res.json({
                success: false,
                msg: 'Something went wrong!'
              });
              return _context.abrupt("return");

            case 15:
              // Fetching OTP
              console.log('DATA FROM REDIS ON' + req.body.OTP + 'KEY:' + token);

              if (token) {
                _context.next = 19;
                break;
              }

              res.status(401).json({
                success: false,
                message: 'OTP is invalid!'
              });
              return _context.abrupt("return");

            case 19:
              // Verifying token
              _jwt$verify = _jsonwebtoken["default"].verify(token, process.env.JWT_MAIL_SECRET), email = _jwt$verify.email, OTP = _jwt$verify.OTP;

              if (!(!email || !OTP || OTP !== req.body.OTP)) {
                _context.next = 23;
                break;
              }

              // JWT not verified
              res.status(401).json({
                success: false,
                message: 'Request a verification email again. Your OTP is either incorrect or expired.'
              });
              return _context.abrupt("return");

            case 23:
              _context.next = 25;
              return db.findOne({
                email: email
              });

            case 25:
              user = _context.sent;
              console.log('USER CONFIRMED? ' + user.isConfirmed);

              if (!(user.isConfirmed === true)) {
                _context.next = 31;
                break;
              }

              res.status(200).json({
                success: true,
                message: 'Your email is already verified'
              });

              _store["default"].del(OTP);

              return _context.abrupt("return");

            case 31:
              user.isConfirmed = true; // Email Verification Success

              db.merge(user);
              db.save(user);

              _store["default"].del(OTP);

              res.status(200).json({
                success: true,
                message: 'Email Verified. You may proceed to login.'
              });

            case 36:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 10]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var _default = handleEmailVerification;
exports["default"] = _default;