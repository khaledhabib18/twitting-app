const express = require("express");
const userController = require("../controllers/userController");
const userRoute = express.Router();
const validate = require("../middlewares/validate");
const check = require("../middlewares/check");
require("dotenv").config();

const {
  SignUpRequestSchema,
  SignInRequestSchema,
} = require("../schemas/userSchemas");

userRoute.post(
  "/sign-up-request",
  validate(SignUpRequestSchema),
  userController.signUp
);

userRoute.post(
  "/sign-in-request",
  validate(SignInRequestSchema),
  userController.signIn
);

userRoute.get(
  "/get-user-data",
  check(process.env.JWT_SECRET),
  userController.getUserData
);

module.exports = userRoute;
