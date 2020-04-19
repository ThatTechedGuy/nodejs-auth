"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validSchema = require("./../services/validSchema");

var _passwordUtils = require("../services/passwordUtils");

var _emailVerification = require("../services/emailVerification");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var handleRegister = function handleRegister(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _registerSchema$valid, error, value, _req$body, username, fullName, email, password, emailExists, usernameExists, hash, user, result;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Sanitize the request body
              _registerSchema$valid = _validSchema.registerSchema.validate(req.body), error = _registerSchema$valid.error, value = _registerSchema$valid.value;

              if (!(error !== undefined)) {
                _context.next = 4;
                break;
              }

              // Incoming data not valid
              res.status(401).json({
                success: false,
                message: error.message
              });
              return _context.abrupt("return");

            case 4:
              _req$body = req.body, username = _req$body.username, fullName = _req$body.fullName, email = _req$body.email, password = _req$body.password; // Checking if email exists

              _context.next = 7;
              return db.findOne({
                email: email
              });

            case 7:
              emailExists = _context.sent;

              if (!(emailExists !== undefined)) {
                _context.next = 11;
                break;
              }

              res.status(401).json({
                success: false,
                message: "Email already exists"
              });
              return _context.abrupt("return");

            case 11:
              _context.next = 13;
              return db.findOne({
                username: username
              });

            case 13:
              usernameExists = _context.sent;

              if (!(usernameExists !== undefined)) {
                _context.next = 17;
                break;
              }

              res.status(401).json({
                success: false,
                message: "Username already exists"
              });
              return _context.abrupt("return");

            case 17:
              _context.next = 19;
              return (0, _passwordUtils.hashPassword)(password);

            case 19:
              hash = _context.sent;

              if (!(hash === undefined)) {
                _context.next = 23;
                break;
              }

              res.status(401).json({
                success: false,
                message: "Something went wrong. Please try again."
              });
              return _context.abrupt("return");

            case 23:
              // Storing object in database
              user = db.create();
              user.email = email;
              user.fullName = fullName;
              user.username = username;
              user.hash = hash;
              _context.next = 30;
              return db.save(user);

            case 30:
              result = _context.sent;
              console.log(result); // Send confirmation mail

              (0, _emailVerification.sendEmailVerification)(email); // Success

              res.status(200).json({
                success: true,
                message: "Registered Successfully"
              });
              return _context.abrupt("return");

            case 35:
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

var register = {
  handleRegister: handleRegister
};
var _default = register;
exports["default"] = _default;