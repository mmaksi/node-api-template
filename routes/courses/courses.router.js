const express = require("express");

const {
  httpGetAllCourses,
  httpGetCourse,
  httpAddCourse,
  httpUpdateCourse,
  httpDeleteCourse,
} = require("./courses.controller");

const advFiltering = require("../../middleware/advFilters");
const coursesDatabase = require("../../models/Course.mongo");
const { protect, authorize } = require("../../middleware/auth.middleware");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get(
  "/",
  advFiltering(coursesDatabase, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetAllCourses
);
coursesRouter.post(
  "/",
  protect,
  authorize("admin", "publisher"),
  httpAddCourse
);

coursesRouter.get("/:id", httpGetCourse);
coursesRouter.post(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  httpAddCourse
);
coursesRouter.put(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  httpUpdateCourse
);
coursesRouter.delete(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  httpDeleteCourse
);

module.exports = coursesRouter;
