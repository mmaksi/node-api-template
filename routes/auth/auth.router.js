const express = require("express");
const {
  httpRegisterUser,
  httpSigninUser,
  getCurrentUser,
  httpForgotPassword,
} = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post("/forgotpassword", httpForgotPassword);
authRouter.post("/register", httpRegisterUser);
authRouter.post("/login", httpSigninUser);

authRouter.get("/me", protect, getCurrentUser);

module.exports = authRouter;
