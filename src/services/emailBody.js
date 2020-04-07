import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "./sendMail";
import generateOTP from './otp';
dotenv.config();

/* Mail content is abstracted here*/

export const sendEmailVerification = (email) => {
  const OTP = generateOTP();
  const emailToken = jwt.sign(
    {
      email: email,
      otp : OTP
    }, // payload
    process.env.JWT_MAIL_SECRET, //secret
    { expiresIn: "2 days" } //expiration
  );
  const subject = "Mealtimify Email Verification Link";
  const text = `Please use this One Time Password in the app to complete the verification: ${OTP}`;
  sendMail(email, subject, text);
};

export const sendPasswordFormLink = (email) => {
  const emailToken = jwt.sign(
    {
      email: email,
      otp: OTP
    },
    process.env.JWT_PASSWORD_RESET_SECRET,
    {expiresIn: "24h"}
  );

  const subject = "Mealtimify Reset Password Link";
  const text = `Please paste this One Time Password in the app to set a new password: ${OTP}`;

  sendMail(email, subject, text);
}
