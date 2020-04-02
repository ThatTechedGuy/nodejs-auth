import argon2 from "argon2";

export const hashPassword = async password => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const comparePassword = async (hash, password) => {
  try {
    if (await argon2.verify(hash, password)) {
      // password match
      return true;
    } else {
      // password did not match
      return false;
    }
  } catch (err) {
    // internal failure
    return false;
  }
};
