import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secureConnection: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmailVerification = (email) => {
  console.log("REACHED MAIL FUNCTION");
  const emailToken = jwt.sign(
    {
      email: email,
    }, // payload
    process.env.JWT_MAIL_SECRET, //secret
    { expiresIn: "2 days" } //expiration
  );

  const url = `http://localhost:${process.env.PORT}/confirmaton/${emailToken}`;

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Mealtimify Email Verification Link",
    text: `Please visit this link to complete the verification: ${url}`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      //error
      console.log("ERROR WHILE SENDING MAIL" + err);
    } else {
      //success
      console.log("SUCCESS : MAIL SENT");
    }
  });
};
