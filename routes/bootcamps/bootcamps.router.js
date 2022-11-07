const express = require("express");
const app = require("../../server");
const api = require("../api");
const coursesRouter = require("../courses/courses.router");
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

// Reroutering to other resources
bootcampsRouter.use("/:id/courses", coursesRouter);

// Internal routes
bootcampsRouter.get("/", httpGetAllBootcamps);
bootcampsRouter.post("/", httpCreateBootcamp);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put("/:id", httpUpdateBootcamp);
bootcampsRouter.delete("/:id", httpDeleteBootcamp);

bootcampsRouter.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

module.exports = bootcampsRouter;
