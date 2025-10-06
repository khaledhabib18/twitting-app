const express = require("express");
const userController = require("../controllers/userController");
const userRoute = express.Router();
const SignUpRequestSchema = require("../schemas/userSchemas");
const validate = require("../middlewares/validate");
const SignInRequestSchema = require("../schemas/userSchemas");

userRoute.post(
  "/sign-up-request",
  validate(SignUpRequestSchema),
  userController.signUp
);

userRoute.post(
  "/sign-in-request",
  validate(SignInRequestSchema),
  userController.signUp
);

module.exports = userRoute;
