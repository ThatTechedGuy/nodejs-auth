"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secureConnection: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

var sendMail = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email, subject, text) {
    var mailOptions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mailOptions = {
              from: process.env.NODEMAILER_EMAIL,
              to: email,
              subject: subject,
              text: text
            };
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                //error
                console.log('ERROR WHILE SENDING MAIL' + err);
              } else {
                //success
                console.log('SUCCESS : MAIL SENT');
              }
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendMail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = sendMail;
exports["default"] = _default;