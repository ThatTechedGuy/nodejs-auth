import { handlePasswordSchema } from '../services/validSchema';
import redis from '../services/store';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../services/passwordUtils';

const handlePasswordReset = (db) => async (req, res) => {
  const { error, value } = handlePasswordSchema.validate(req.body);
  if (error !== undefined) {
    res.status(200).json({ success: false, message: error.message });
    return;
  }

  const { OTP, password } = value;
  let passwordResetToken;
  try {
    passwordResetToken = await redis.get(OTP);
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: 'OTP invalid/expired' });
    return;
  }

  jwt.verify(
    passwordResetToken,
    process.env.JWT_PASSWORD_RESET_SECRET,
    async (err, decoded) => {
      if (decoded === undefined || err) {
        res.json({ success: false, message: 'OTP invalid/expired' });
        return;
      } else {
        const {email} = decoded;
        const hash = await hashPassword(password);

        const user = await db.findOne({email});
        user.hash = hash;

        db.merge(user);
        db.save(user);

        redis.del(OTP);

        res.json({success: true, message: 'User saved!'});
        return;
      }
    }
  );
  return;
};

export default handlePasswordReset;
