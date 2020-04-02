import { registerSchema } from "./../services/validSchema";
import { hashPassword } from "../services/passwordUtils";

const handleRegister = db => async (req, res) => {
  // Sanitize the request body
  const { error, value } = registerSchema.validate(req.body);
  
  if (error !== undefined) {
    // Incoming data not valid
    res.status(401).json({ success: false, message: error.message });
    return;
  }

  const { username, fullName, email, password } = req.body;


  // Checking if email exists
  const emailExists = await db.findOne({ email });

  if (emailExists !== undefined) {
    res.status(401).json({ success: false, message: "User email already exists" });
    return;
  }

  // Checking if username exists
  const usernameExists = await db.findOne({ username });

  if (usernameExists !== undefined) {
    res.status(401).json({ success: false, message: "Username already exists" });
    return;
  }


  // Hashing password for storage
  const hash = await hashPassword(password);
  if (hash === undefined) {
    res.status(401).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
    return;
  }

  // Storing object in database
  const user = db.create();
  user.email = email;
  user.fullName = fullName;
  user.username = username;
  user.hash = hash;

  const result = await db.save(user);

  console.log(result);


  // Success
  res.status(200).json({ success: true, message: "Registered Successfully" });
  return;
};

const register = {
  handleRegister: handleRegister
};

export default register;
