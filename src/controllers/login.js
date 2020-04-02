import { loginSchema } from "../services/validSchema";
import { comparePassword } from "../services/passwordUtils";

const handleLogin = db => async (req, res) => {
  // Sanitizing the request body
  const { error, value } = loginSchema.validate(req.body);

  if (error !== undefined) {
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  const { username, email, password } = value;

  // Checking for username or email
  var user;
  if ("username" in value) user = await db.findOne({ username });
  else user = await db.findOne({ email });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "User not found. Please register first."
    });
    return;
  }

  // Comparing password with stored hash
  const hash = user.hash;
  const result = await comparePassword(hash, password);
  if (result === false) {
    res.status(401).json({ success: false, message: "Password is incorrect." });
    return;
  }

  // Success
  res.status(200).json({ success: true, message: "Logged in successfully" });
};

const login = {
  handleLogin: handleLogin
};

export default login;
