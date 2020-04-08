import { emailVerificationSchema } from '../services/validSchema';
import { sendEmailVerification } from '../services/emailVerification';

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
  
    // Does not exist
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: 'Unknown username / email.' });
      return;
    }
    
    // Checking if already confirmed
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

  export default sendEmailConfirmation;
  