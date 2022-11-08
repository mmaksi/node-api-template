const express = require("express");
const app = require("../../server");
const api = require("../api");

const {
  httpGetAllCourses,
  httpGetCourse,
  httpAddCourse,
  httpUpdateCourse,
  httpDeleteCourse,
} = require("./courses.controller");

const advFiltering = require("../../middleware/advFilters");
const coursesDatabase = require("../../models/Course.mongo");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get(
  "/",
  advFiltering(coursesDatabase, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetAllCourses
);
coursesRouter.post("/", httpAddCourse);

coursesRouter.get("/:id", httpGetCourse);
coursesRouter.post("/:id", httpAddCourse);
coursesRouter.put("/:id", httpUpdateCourse);
coursesRouter.delete("/:id", httpDeleteCourse);

module.exports = coursesRouter;
