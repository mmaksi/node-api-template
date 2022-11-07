const express = require("express");
const app = require("../../server");
const api = require("../api");

const { httpGetAllCourses, httpGetCourse } = require("./courses.controller");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.get("/", httpGetAllCourses);
coursesRouter.get("/:id", httpGetCourse);

module.exports = coursesRouter;
