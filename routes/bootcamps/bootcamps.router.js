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
  httpUploadPhoto,
} = require("./bootcamps.controller");

const bootcampsDatabase = require("../../models/Bootcamp.mongo");
const advFiltering = require("../../middleware/advFilters");

const bootcampsRouter = express.Router();

// Reroutering to other resources
bootcampsRouter.use("/:id/courses", coursesRouter);

// Internal routes
bootcampsRouter.get(
  "/",
  advFiltering(bootcampsDatabase, "courses"),
  httpGetAllBootcamps
);
bootcampsRouter.post("/", httpCreateBootcamp);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put("/:id", httpUpdateBootcamp);
bootcampsRouter.delete("/:id", httpDeleteBootcamp);

bootcampsRouter.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

bootcampsRouter.put("/:id/photo", httpUploadPhoto);

module.exports = bootcampsRouter;
