import redis from './store';
import jwt from 'jsonwebtoken';
import generateOTP from './otp';
import sendMail from './sendMail';

export const sendEmailVerification = (email) => {
  const OTP = generateOTP();
  const emailToken = jwt.sign(
    {
      email: email,
      OTP : OTP
    }, // payload
    process.env.JWT_MAIL_SECRET, //secret
    { expiresIn: "2 days" } //expiration
  );

  const subject = "Mealtimify Email Verification Link";
  const text = `Please use this One Time Password in the app to complete the verification: ${OTP}`;
  redis.set(OTP, emailToken);
  sendMail(email, subject, text);
};