const express = require("express");
const tweetsController = require("../controllers/tweetsController");
const tweetsRoute = express.Router();
const validate = require("../middlewares/validate");
const check = require("../middlewares/check");
require("dotenv").config();

const {
  SignUpRequestSchema,
  SignInRequestSchema,
} = require("../schemas/userSchemas");

tweetsRoute.get("/get-tweets", tweetsController.getAllTweets);

module.exports = tweetsRoute;
