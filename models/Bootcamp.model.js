const bootcampDatabase = require("./Bootcamp.mongo");

async function getAllBootcamps() {
  try {
    const bootcamps = await bootcampDatabase.find();
    return bootcamps;
  } catch (error) {
    console.log(error);
  }
}

async function getBootcampById(id) {
  try {
    const bootcamp = await bootcampDatabase.findById(id);
    return bootcamp;
  } catch (error) {
    console.log(error);
  }
}

async function createBootcamp(bootcamp) {
  const createdBootcamp = await bootcampDatabase.create(bootcamp);
  return createdBootcamp;
}

async function updateBootcamp(id, bootcamp) {
  const createdBootcamp = await bootcampDatabase.findByIdAndUpdate(
    id,
    bootcamp,
    // new: the response is the updated document
    // runValidators of the model's schema
    { new: true, runValidators: true }
  );
  return createdBootcamp;
}

async function deleteBootcamp(id) {
  const deletedBootcamp = await bootcampDatabase.findByIdAndRemove(id, {});
  return deletedBootcamp;
}

module.exports = {
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
