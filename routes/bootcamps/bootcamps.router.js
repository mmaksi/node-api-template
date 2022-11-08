const express = require("express");
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
const protect = require("../../middleware/auth.middleware");

const bootcampsRouter = express.Router();

// Reroutering to other resources
bootcampsRouter.use("/:id/courses", coursesRouter);

// Internal routes
bootcampsRouter.get(
  "/",
  advFiltering(bootcampsDatabase, "courses"),
  httpGetAllBootcamps
);
bootcampsRouter.post("/", protect, httpCreateBootcamp);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put("/:id", protect, httpUpdateBootcamp);
bootcampsRouter.delete("/:id", protect, httpDeleteBootcamp);

bootcampsRouter.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

bootcampsRouter.put("/:id/photo", protect, httpUploadPhoto);

module.exports = bootcampsRouter;
