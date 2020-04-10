"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _validSchema = require("../services/validSchema");

var _store = _interopRequireDefault(require("../services/store"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _passwordUtils = require("../services/passwordUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var handlePasswordReset = function handlePasswordReset(db) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var _handlePasswordSchema, error, value, OTP, password, passwordResetToken;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _handlePasswordSchema = _validSchema.handlePasswordSchema.validate(req.body), error = _handlePasswordSchema.error, value = _handlePasswordSchema.value;

              if (!(error !== undefined)) {
                _context2.next = 4;
                break;
              }

              res.status(200).json({
                success: false,
                message: error.message
              });
              return _context2.abrupt("return");

            case 4:
              OTP = value.OTP, password = value.password;
              _context2.prev = 5;
              _context2.next = 8;
              return _store["default"].get(OTP);

            case 8:
              passwordResetToken = _context2.sent;
              _context2.next = 16;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](5);
              console.log(_context2.t0.message);
              res.json({
                success: false,
                message: 'OTP invalid/expired'
              });
              return _context2.abrupt("return");

            case 16:
              _jsonwebtoken["default"].verify(passwordResetToken, process.env.JWT_PASSWORD_RESET_SECRET, /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, decoded) {
                  var email, hash, user;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(decoded === undefined || err)) {
                            _context.next = 5;
                            break;
                          }

                          res.json({
                            success: false,
                            message: 'OTP invalid/expired'
                          });
                          return _context.abrupt("return");

                        case 5:
                          email = decoded.email;
                          _context.next = 8;
                          return (0, _passwordUtils.hashPassword)(password);

                        case 8:
                          hash = _context.sent;
                          _context.next = 11;
                          return db.findOne({
                            email: email
                          });

                        case 11:
                          user = _context.sent;
                          user.hash = hash;
                          db.merge(user);
                          db.save(user);

                          _store["default"].del(OTP);

                          res.json({
                            success: true,
                            message: 'User saved!'
                          });
                          return _context.abrupt("return");

                        case 18:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3, _x4) {
                  return _ref2.apply(this, arguments);
                };
              }());

              return _context2.abrupt("return");

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 11]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var _default = handlePasswordReset;
exports["default"] = _default;