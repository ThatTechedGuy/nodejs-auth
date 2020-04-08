import redis from './../services/store';
import jwt from 'jsonwebtoken';

import generateOTP from './../services/otp';

import { passwordConfirmationSchema } from '../services/validSchema';
import sendMail from './../services/sendMail';

const sendResetPasswordLink = (db) => async (req, res) => {
  // Validating the request body
  const { error, value } = passwordConfirmationSchema.validate(req.body);

  if (error !== undefined) {
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  const { email } = value;

  // Checking if the user email exists
  const user = db.findOne({ email });

  if (!user) {
    res.status(400).json({ success: false, message: 'Unknown email.' });
    return;
  }

  // Send password change link through email.
  const OTP = generateOTP();

  const passwordToken = jwt.sign(
    {
      email: email,
      OTP: OTP
    },
    process.env.JWT_PASSWORD_RESET_SECRET,
    { expiresIn: '24h' }
  );

  const subject = 'Mealtimify Reset Password Link';
  const text = `Please paste this One Time Password in the app to set a new password: ${OTP}`;
  // Storing the OTP
  redis.set(OTP, passwordToken);
  // Send mail
  sendMail(email, subject, text);

  // Success
  res.status(200).json({ success: true, message: 'Password OTP sent' });
};

export default sendResetPasswordLink;