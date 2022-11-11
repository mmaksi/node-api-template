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
const { protect, authorize } = require("../../middleware/auth.middleware");
const reviewsRouter = require("../reviews/reviews.router");

const bootcampsRouter = express.Router();

// Reroutering to other resources
bootcampsRouter.use("/:id/courses", coursesRouter);
bootcampsRouter.use("/:bootcampId/reviews", reviewsRouter);

// Internal routes
bootcampsRouter.get(
  "/",
  advFiltering(bootcampsDatabase, "courses"),
  httpGetAllBootcamps
);
bootcampsRouter.post(
  "/",
  protect,
  authorize("admin", "publisher"),
  httpCreateBootcamp
);

bootcampsRouter.get("/:id", httpGetBootcamp);
bootcampsRouter.put(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  httpUpdateBootcamp
);
bootcampsRouter.delete(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  httpDeleteBootcamp
);

bootcampsRouter.get("/radius/:zipcode/:distance", httpGetBootcampsInRadius);

bootcampsRouter.put(
  "/:id/photo",
  protect,
  authorize("admin", "publisher"),
  httpUploadPhoto
);

module.exports = bootcampsRouter;
