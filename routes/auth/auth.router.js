const express = require("express");
const {
  httpRegisterUser,
  httpSigninUser,
  getCurrentUser,
} = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", httpRegisterUser);
authRouter.post("/login", httpSigninUser);
authRouter.get("/me", protect, getCurrentUser);

module.exports = authRouter;
