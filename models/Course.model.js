const coursesDatabase = require("../models/Course.mongo");

const getAllCourses = async () => {
  const allCourses = await coursesDatabase.find();
  return allCourses;
};

const getCourse = async (id) => {
  const course = await coursesDatabase.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  return course;
};

const addCourse = async (id) => {};

const updateCourse = async (id, body) => {
  const course = await coursesDatabase.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  course ? await course.save() : null;
  return course;
};

const deleteCourse = async (id) => {
  const course = await coursesDatabase.findById(id);

  // Make sure user is course owner
  // if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete course ${course._id}`,
  //       401
  //     )
  //   );
  // }
  if (course) {
    await course.remove();
  }
  return course;
};

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
