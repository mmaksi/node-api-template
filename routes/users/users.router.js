const express = require("express");

const { protect, authorize } = require("../../middleware/auth.middleware");

const usersDataBase = require("../../models/User.mongo");

const advFiltering = require("../../middleware/advFilters");

const {
  httpGetAllUsers,
  httpGetUser,
  httpUpdateUser,
  httpDeleteUser,
} = require("./user.controller");

const usersRouter = express.Router();

usersRouter.use(protect);
usersRouter.use(authorize);

usersRouter.get("/", advFiltering(usersDataBase), httpGetAllUsers);
usersRouter.get("/:id", httpGetUser);
usersRouter.put("/:id", httpUpdateUser);
usersRouter.put("/:id", httpDeleteUser);

module.exports = usersRouter;
