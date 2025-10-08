const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get } = require("../routes/userRoutes");
require("dotenv").config();

const registerUser = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  return await userRepository.createUser(userData);
};
const getUser = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
  const uid = decoded.uid;
  const user = await userRepository.getUserByUid(uid);
  return user;
};

const signInUser = async (credentials) => {
  const user = await userRepository.getUserByEmail(credentials.email);
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
  const token = jwt.sign(
    {
      uid: user.uid,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET
  );
  return token;
};

module.exports = {
  registerUser,
  signInUser,
  getUser,
};
