const express = require("express");
const { bootcampsRouter } = require("./bootcamps/bootcamps.router.js");

const api = express.Router();

api.use("/bootcamps", bootcampsRouter);

module.exports = api;
