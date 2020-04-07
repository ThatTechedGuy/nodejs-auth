import { tokenSchema, emailVerificationSchema, passwordConfirmationSchema } from '../services/validSchema';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmailVerification } from '../services/emailBody';
dotenv.config();

const handleEmailVerification = (db) => async (req, res) => {
  // Validate incoming request
  const { error, value } = tokenSchema.validate(req.params);

  if (error !== undefined) {
    // Validation failed
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  try {
    // Verifying token
    const { email } = jwt.verify(req.params.token, process.env.JWT_MAIL_SECRET);

    if (!email) {
      // JWT not verified
      res.json({
        success: false,
        message: 'Send a verification request again. Something went wrong.'
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
  } catch (e) {
    // Failure
    res.status(401).json({
      success: false,
      message: 'Something went wrong. Please verify.'
    });
    return;
  }
};

const sendEmailConfirmation = (db) => async (req, res) => {
  // Validatiing fields
  const { error, value } = emailVerificationSchema.validate(req.body);

  if (error !== undefined) {
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  const { username, email } = value;

  // Checking for username or email
  var user;
  if ('username' in value) user = await db.findOne({ username });
  else user = await db.findOne({ email });

  if (!user) {
    res
      .status(400)
      .json({ success: false, message: 'Unknown username / email.' });
    return;
  }

  if (user.isConfirmed === true) {
    res.status(400).json({
      success: false,
      message: 'Email is already verified. Please login.'
    });
    return;
  }

  // Send a verification email to user.
  sendEmailVerification(user.email);

  // Success
  res.status(200).json({ success: true, message: 'Email confirmation sent' });
};

const sendResetPasswordLink = (db) => (req, res) => {
  // Validating the request body
  const {error, value} = passwordConfirmationSchema.validate(req.body);

  if(error !== undefined){
    res.status(401).json({success: false, message: error.message});
    return;
  }

  const {email} = value;

  // Checking if the user email exists
  const user = db.findOne({email});

  if(!user){
    res.status(400).json({success: false, message:'Unknown email.'});
    return;
  }

  // Send password change link through email.
  


};

const confirmation = {
  handleEmailVerification: handleEmailVerification,
  sendEmailConfirmation: sendEmailConfirmation,
  sendResetPasswordLink: sendResetPasswordLink
};

export default confirmation;
