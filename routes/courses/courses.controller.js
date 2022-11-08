const {
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../../models/Course.model");
const coursesDatabase = require("../../models/Course.mongo");
const bootcampsData = require("../../models/Bootcamp.mongo");
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
    const courses = await getAllCourses();
    res.status(200).json(res.advancedResults);
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

const httpAddCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.id;
  // req.body.user = req.user.id;

  const bootcamp = await getBootcampById(req.params.id);
  console.log(bootcamp);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
  //       401
  //     )
  //   );
  // }

  const course = await coursesDatabase.create(req.body);

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
  httpAddCourse,
  httpUpdateCourse,
  httpDeleteCourse,
};
