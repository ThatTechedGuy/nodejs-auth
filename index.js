"use strict";

require("reflect-metadata");



var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _typeorm = require("typeorm");

var _User = _interopRequireDefault(require("./dist/entity/User.js"));

var _app = _interopRequireDefault(require("./dist/app"));

var _login = _interopRequireDefault(require("./dist/controllers/login"));

var _register = _interopRequireDefault(require("./dist/controllers/register"));

var _confirmation = _interopRequireDefault(require("./dist/controllers/confirmation"));

var _store = _interopRequireDefault(require("./dist/services/store.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var PORT = process.env.PORT || 5000;

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
  var app, connection, db;
  return regeneratorRuntime.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          app = (0, _express["default"])();
          /* Connecting to DB */

          _context3.next = 3;
          return (0, _typeorm.createConnection)();

        case 3:
          connection = _context3.sent;
          console.log('HELLO');
          db = connection.getRepository(_User["default"]);
          app.use(_app["default"]);
          app.listen(PORT, function () {
            return console.log('SERVER RUNNING on port:' + PORT);
          });
          app.get('/', function (_, res) {
            return res.status(200).json({
              success: true,
              message: 'API Working!!'
            });
          }); // Login User Account

          app.post('/user/login', _login["default"].handleLogin(db)); // Register a User

          app.post('/user/register', _register["default"].handleRegister(db)); // Sends email confirmation link

          app.post('/user/sendEmailConfirmation', _confirmation["default"].sendEmailConfirmation(db)); // Receives email confirmation through OTP

          app.post('/user/getEmailConfirmation', _confirmation["default"].handleEmailVerification(db));
          app.post('/user/sendPasswordReset', _confirmation["default"].sendResetPasswordLink(db));
          app.post('/user/getPasswordReset', _confirmation["default"].handlePasswordReset(db));
          /* Test */

          app.get('/users', /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, res) {
              var users;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return db.find();

                    case 2:
                      users = _context.sent;
                      res.json({
                        users: users
                      });

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x, _x2) {
              return _ref2.apply(this, arguments);
            };
          }());
          app.get('/clear', /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_, res) {
              var users;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return db.clear();

                    case 2:
                      _store["default"].keys('*').then(function (keys) {
                        // Using pipeline instead of sending
                        // one command each time to improve the
                        // performance.
                        var pipeline = _store["default"].pipeline();

                        keys.forEach(function (key) {
                          pipeline.del(key);
                        });
                        return pipeline.exec();
                      });

                      _context2.next = 5;
                      return db.find();

                    case 5:
                      users = _context2.sent;
                      res.json(users);

                    case 7:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

            return function (_x3, _x4) {
              return _ref3.apply(this, arguments);
            };
          }());

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}))();