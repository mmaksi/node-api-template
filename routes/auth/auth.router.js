const express = require("express");
const { httpRegisterUser, httpSigninUser } = require("./auth.controller");

const authRouter = express.Router();

authRouter.post("/register", httpRegisterUser);
authRouter.post("/login", httpSigninUser);

module.exports = authRouter;
