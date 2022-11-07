const geocoder = require("../utils/geocoder");
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
    const news = bootcamp.skip(1);
    console.log({ news });
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

async function getBootcampsInRadius(zipcode, distance) {
  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await bootcampDatabase.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  return bootcamps;
}

module.exports = {
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
};
