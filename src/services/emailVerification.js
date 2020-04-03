import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "./sendMail";
dotenv.config();


export const sendEmailVerification = (email) => {
  const emailToken = jwt.sign(
    {
      email: email,
    }, // payload
    process.env.JWT_MAIL_SECRET, //secret
    { expiresIn: "2 days" } //expiration
  );

  const url = `http://localhost:${process.env.PORT}/confirmation/${emailToken}`;
  const subject = "Mealtimify Email Verification Link";
  const text = `Please visit this link to complete the verification: ${url}`;

  sendMail(email, subject, text);
};
