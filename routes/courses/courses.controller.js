const {
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../../models/Course.model");
const coursesDatabase = require("../../models/Course.mongo");
const { getBootcampById } = require("../../models/Bootcamp.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const httpGetAllCourses = asyncHandler(async (req, res, next) => {
  if (req.params.id) {
    // Get courses of a specific bootcamp
    const courses = await coursesDatabase.find({ bootcamp: req.params.id });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
    // Get all courses
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single course
// @route     GET /v1/courses/:id
// @access    Public
const httpGetCourse = asyncHandler(async (req, res, next) => {
  const course = await getCourse(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Delete course
// @route     POST /v1/courses/:id
// @access    Private
const httpAddCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.id;
  req.body.user = req.user.id;

  const bootcamp = await getBootcampById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User is not authorized to add a course to this bootcamp`,
        401
      )
    );
  }

  const course = await coursesDatabase.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc      Update course
// @route     PUT /v1/courses/:id
// @access    Private
const httpUpdateCourse = asyncHandler(async (req, res, next) => {
  const foundCourse = await getCourse(req.params.id);
  if (!foundCourse) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  } else {
    // Make sure user is course owner
    if (
      foundCourse.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(`User is not authorized to update this course`, 401)
      );
    } else {
      const updatedCourse = await updateCourse(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: updatedCourse,
      });
    }
  }
});

// @desc      Delete course
// @route     DELETE /v1/courses/:id
// @access    Private
const httpDeleteCourse = asyncHandler(async (req, res, next) => {
  const foundCourse = await getCourse(req.params.id);
  if (!foundCourse) {
  } else {
    // Make sure user is course owner
    if (
      foundCourse.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(`User is not authorized to delete this course`, 401)
      );
    } else {
      await deleteCourse(req.params.id);
      res.status(200).json({
        success: true,
        data: {},
      });
    }
  }
});

module.exports = {
  httpGetAllCourses,
  httpGetCourse,
  httpAddCourse,
  httpUpdateCourse,
  httpDeleteCourse,
};
