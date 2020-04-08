import redis from './../services/store';
import jwt from 'jsonwebtoken';
import { otpSchema } from '../services/validSchema';

const handleEmailVerification = (db) => async (req, res) => {
  // Validate incoming request
  const { error, value } = otpSchema.validate(req.body);

  if (error !== undefined) {
    // Validation failed
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  // Fetching OTP
  const token = await redis.get(req.body.OTP);

  if(!token){
    res.status(401).json({success: false, message: "OTP is invalid!"});
    return;
  }

  // Verifying token
  const { email, OTP } = jwt.verify(
    token,
    process.env.JWT_MAIL_SECRET
  );

  if (!email || !OTP || OTP !== req.body.OTP) {
    // JWT not verified
    res.json({
      success: false,
      message: 'Request a verification email again. Your OTP is either incorrect or expired.'
    });
    return;
  }

  // Fetching user details
  const user = await db.findOne({ email });
  user.isConfirmed = true;

  // Email Verification Success
  db.merge(user);
  db.save(user);

  res.status(200).json({
    success: true,
    message: 'Email Verified. You may proceed to login.'
  });
};

export default handleEmailVerification;