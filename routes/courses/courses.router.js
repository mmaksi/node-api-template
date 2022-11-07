const express = require("express");
const app = require("../../server");
const api = require("../api");

const {
  httpGetAllCourses,
  httpGetCourse,
  httpUpdateCourse,
  httpDeleteCourse,
} = require("./courses.controller");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get("/", httpGetAllCourses);
coursesRouter.get("/:id", httpGetCourse);
coursesRouter.put("/:id", httpUpdateCourse);
coursesRouter.delete("/:id", httpDeleteCourse);

module.exports = coursesRouter;
