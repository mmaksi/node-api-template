const reviewsDatabase = require("./Review.mongo");
const bootcampsDatabase = require("./Bootcamp.mongo");

const getAllReviews = async () => {
  const reviews = await reviewsDatabase.find();
  return reviews;
};

const getBootcampReviews = async (bootcampId) => {
  const bootcampReviews = await reviewsDatabase.find({ bootcamp: bootcampId });

  return bootcampReviews;
};

const getReviewById = async (id) => {
  const review = await reviewsDatabase.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });
  return review;
};

const addReviewToBootcamp = async (review) => {
  const foundBootcamp = await bootcampsDatabase.findById(review.bootcamp);
  const newReview = foundBootcamp ? await reviewsDatabase.create(review) : null;
  return newReview;
};

module.exports = {
  getAllReviews,
  getBootcampReviews,
  getReviewById,
  addReviewToBootcamp,
};
