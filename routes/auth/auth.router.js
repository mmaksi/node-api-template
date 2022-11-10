const express = require("express");
const {
  httpRegisterUser,
  httpSigninUser,
  getCurrentUser,
  httpForgotPassword,
  httpResetPassword,
  httpUpdateDetails,
  httpUpdatePassword,
} = require("./auth.controller");
const { protect } = require("../../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.put("/resetpassword/:resettoken", httpResetPassword);
authRouter.put("/updatedetails", protect, httpUpdateDetails);
authRouter.put("/updatepassword", protect, httpUpdatePassword);

authRouter.post("/forgotpassword", httpForgotPassword);
authRouter.post("/register", httpRegisterUser);
authRouter.post("/login", httpSigninUser);

authRouter.get("/me", protect, getCurrentUser);

module.exports = authRouter;
