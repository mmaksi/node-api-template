const express = require("express");
const app = require("../../server");
const api = require("../api");
const {
  httpGetAllBootcamps,
  httpGetBootcamp,
  httpCreateBootcamp,
  httpUpdateBootcamp,
  httpDeleteBootcamp,
  httpGetBootcampsInRadius,
  httpBootcampPhotoUp,
} = require("./bootcamps.controller");

const bootcampsRouter = express.Router();
console.log("1");

bootcampsRouter.get("/", httpGetAllBootcamps);
bootcampsRouter.post("/", httpCreateBootcamp);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put("/:id", httpUpdateBootcamp);
bootcampsRouter.delete("/:id", httpDeleteBootcamp);
console.log("2");

module.exports = bootcampsRouter;
