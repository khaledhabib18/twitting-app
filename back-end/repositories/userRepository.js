const userModel = require("../models/userModel");

const createUser = async (userData) => {
  return await userModel.create(userData);
};

const getUserByEmail = async (email) => {
  return await userModel.findOne({ where: { email } });
};
const getUserByUid = async (uid) => {
  return await userModel.findOne({ where: { uid } });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUid,
};
