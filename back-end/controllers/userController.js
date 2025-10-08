const { get } = require("../routes/userRoutes");
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
    const token = await userServices.signInUser(req.body);
    res.status(201).json({ token: token });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = await userServices.getUser(token);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

module.exports = {
  signUp,
  signIn,
  getUserData,
};
