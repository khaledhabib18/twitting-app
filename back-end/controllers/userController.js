const userServices = require("../services/userServices");

const signUp = async (req, res) => {
  try {
    const newUser = await userServices.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const signIn = async (req, res) => {
  try {
    const User = await userServices.signInUser(req.body);
    res.status(201).json(User.token);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

module.exports = {
  signUp,
  signIn,
};
