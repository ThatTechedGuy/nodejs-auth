import { loginSchema } from '../services/validSchema';
import { comparePassword } from '../services/passwordUtils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const handleLogin = (db) => async (req, res) => {
  // Sanitizing the request body
  const { error, value } = loginSchema.validate(req.body);

  if (error !== undefined) {
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  const { username, email, password } = value;

  // Checking for username or email
  var user;
  if ('username' in value) user = await db.findOne({ username });
  else user = await db.findOne({ email });

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'User not found. Please register first.'
    });
    return;
  }

  // Checking if email is verified
  if (user.isConfirmed === false) {
    res.status(401).json({
      success: false,
      message: 'Email not verified. Verify email first.'
    });
    return;
  }

  // Checking if password is correct by comparing password with stored hash
  const { hash, ...data } = user;
  const result = await comparePassword(hash, password);
  if (result === false) {
    res.status(401).json({ success: false, message: 'Password is incorrect.' });
    return;
  }

  const accessToken = jwt.sign(data, process.env.JWT_LOGIN_SECRET, {
    expiresIn: '15d'
  });

  // Success
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: data,
    token: accessToken
  });
};

const login = {
  handleLogin: handleLogin
};

export default login;
