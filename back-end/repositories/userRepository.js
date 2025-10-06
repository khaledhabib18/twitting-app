const userModel = require("../models/userModel");

const createUser = async (userData) => {
  return await userModel.create(userData);
};

const getUserByUID = async (uid) => {
  return await userModel.findOne({ where: { uid } });
};

module.exports = {
  createUser,
  getUserByUID,
};
