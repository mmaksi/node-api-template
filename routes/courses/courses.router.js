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
const protect = require("../../middleware/auth.middleware");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get(
  "/",
  advFiltering(coursesDatabase, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetAllCourses
);
coursesRouter.post("/", protect, httpAddCourse);

coursesRouter.get("/:id", httpGetCourse);
coursesRouter.post("/:id", protect, httpAddCourse);
coursesRouter.put("/:id", protect, httpUpdateCourse);
coursesRouter.delete("/:id", protect, httpDeleteCourse);

module.exports = coursesRouter;
