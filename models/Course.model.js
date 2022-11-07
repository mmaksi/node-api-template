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

module.exports = {
  getAllCourses,
  getCourse,
};
