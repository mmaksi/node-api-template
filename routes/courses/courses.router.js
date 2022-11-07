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

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get("/", httpGetAllCourses);
coursesRouter.post("/", httpAddCourse);

coursesRouter.get("/:id", httpGetCourse);
coursesRouter.post("/:id", httpAddCourse);
coursesRouter.put("/:id", httpUpdateCourse);
coursesRouter.delete("/:id", httpDeleteCourse);

module.exports = coursesRouter;
