"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validSchema = require("../services/validSchema");

var _passwordUtils = require("../services/passwordUtils");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _store = _interopRequireDefault(require("../services/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var handleLogin = function handleLogin(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _loginSchema$validate, error, value, token, username, email, password, user, _user, hash, data, result, accessToken;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Sanitizing the request body
              _loginSchema$validate = _validSchema.loginSchema.validate(req.body), error = _loginSchema$validate.error, value = _loginSchema$validate.value;

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
              token = value.token;

              if (!token) {
                _context.next = 8;
                break;
              }

              _jsonwebtoken["default"].verify(token, process.env.JWT_LOGIN_SECRET, function (err, decoded) {
                if (decoded === undefined || err) {
                  res.status(401).json({
                    success: false,
                    message: 'Expired or invalid.'
                  });
                  return;
                } else {
                  res.status(200).json({
                    success: true,
                    message: 'Token verified!'
                  });
                  return;
                }
              });

              return _context.abrupt("return");

            case 8:
              username = value.username, email = value.email, password = value.password; // Checking for username or email

              if (!('username' in value)) {
                _context.next = 15;
                break;
              }

              _context.next = 12;
              return db.findOne({
                username: username
              });

            case 12:
              user = _context.sent;
              _context.next = 18;
              break;

            case 15:
              _context.next = 17;
              return db.findOne({
                email: email
              });

            case 17:
              user = _context.sent;

            case 18:
              if (user) {
                _context.next = 21;
                break;
              }

              res.status(401).json({
                success: false,
                message: 'User not found. Please register first.'
              });
              return _context.abrupt("return");

            case 21:
              if (!(user.isConfirmed === false)) {
                _context.next = 24;
                break;
              }

              res.status(401).json({
                success: false,
                message: 'Email not verified. Verify email first.'
              });
              return _context.abrupt("return");

            case 24:
              // Checking if password is correct by comparing password with stored hash
              _user = user, hash = _user.hash, data = _objectWithoutProperties(_user, ["hash"]);
              _context.next = 27;
              return (0, _passwordUtils.comparePassword)(hash, password);

            case 27:
              result = _context.sent;

              if (!(result === false)) {
                _context.next = 31;
                break;
              }

              res.status(401).json({
                success: false,
                message: 'Password is incorrect.'
              });
              return _context.abrupt("return");

            case 31:
              accessToken = _jsonwebtoken["default"].sign(data, process.env.JWT_LOGIN_SECRET, {
                expiresIn: '7d'
              }); // Success

              res.status(200).json({
                success: true,
                message: 'Logged in successfully',
                data: data,
                token: accessToken
              });

            case 33:
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

var login = {
  handleLogin: handleLogin
};
var _default = login;
exports["default"] = _default;