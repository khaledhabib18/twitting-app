const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  return await userRepository.createUser(userData);
};

const signInUser = async (credentials) => {
  const user = await userRepository.getUserByUID(credentials.uid);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.token = token;
  return user;
};

module.exports = {
  registerUser,
  signInUser,
};
