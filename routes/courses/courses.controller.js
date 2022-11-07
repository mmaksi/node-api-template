const {
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../../models/Course.model");
const coursesDatabase = require("../../models/Course.mongo");
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
    const courses = await getAllCourses();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
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

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
const httpUpdateCourse = asyncHandler(async (req, res, next) => {
  const foundCourse = await getCourse(req.params.id);
  const updatedCourse = await updateCourse(req.params.id, req.body);
  if (!foundCourse || !updatedCourse) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  return res.status(200).json({
    success: true,
    data: updatedCourse,
  });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
const httpDeleteCourse = asyncHandler(async (req, res, next) => {
  const deletedCourse = await deleteCourse(req.params.id);
  if (deletedCourse) {
    res.status(200).json({
      success: true,
      data: {},
    });
  } else {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }
});

module.exports = {
  httpGetAllCourses,
  httpGetCourse,
  httpUpdateCourse,
  httpDeleteCourse,
};
