import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

var transporter = nodemailer.createTransport({
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

const sendMail = async (email, subject, text) => {
  var mailOptions = {
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
};

export default sendMail;
