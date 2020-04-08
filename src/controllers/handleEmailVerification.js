import redis from './../services/store';
import jwt from 'jsonwebtoken';
import { otpSchema } from '../services/validSchema';

const handleEmailVerification = (db) => async (req, res) => {
  // Validate incoming request
  const { error } = otpSchema.validate(req.body);

  if (error !== undefined) {
    // Validation failed
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  let token;
  try {
    token = await redis.get(req.body.OTP);
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, msg: 'Something went wrong!' });
    return;
  }
  // Fetching OTP
  console.log('DATA FROM REDIS ON' + req.body.OTP + 'KEY:' + token);

  if (!token) {
    res.status(401).json({ success: false, message: 'OTP is invalid!' });
    return;
  }

  // Verifying token
  const { email, OTP } = jwt.verify(token, process.env.JWT_MAIL_SECRET);

  if (!email || !OTP || OTP !== req.body.OTP) {
    // JWT not verified
    res.status(401).json({
      success: false,
      message:
        'Request a verification email again. Your OTP is either incorrect or expired.'
    });
    return;
  }

  // Fetching user details
  const user = await db.findOne({ email });
  console.log('USER CONFIRMED? ' + user.isConfirmed);
  if (user.isConfirmed === true) {
    res
      .status(200)
      .json({ success: true, message: 'Your email is already verified' });
    redis.del(OTP);
    return;
  }

  user.isConfirmed = true;

  // Email Verification Success
  db.merge(user);
  db.save(user);

  redis.del(OTP);

  res.status(200).json({
    success: true,
    message: 'Email Verified. You may proceed to login.'
  });
};

export default handleEmailVerification;
