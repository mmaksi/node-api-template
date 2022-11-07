const { getAllCourses, getCourse } = require("../../models/Course.model");
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

module.exports = {
  httpGetAllCourses,
  httpGetCourse,
};
