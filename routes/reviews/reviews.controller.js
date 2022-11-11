const {
  getAllReviews,
  getReviewById,
  addReviewToBootcamp,
  getBootcampReviews,
} = require("../../models/Review.model");
const asyncHandler = require("../../utils/asyncHandler");

// @desc      Get reviews
// @route     GET /v1/reviews
// @route     GET /v1/bootcamps/:bootcampId/reviews
// @access    Public
const httpGetAllReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await getBootcampReviews(req.params.bootcampId);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get reviews
// @route     GET /v1/reviews/:id
// @access    Public
const httpGetReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await getReviewById(reviewId);
  if (!review) {
    return next(new ErrorResponse(`No review found`, 404));
  } else {
    return res.status(200).json({
      success: true,
      data: review,
    });
  }
});

// @desc      Add review
// @route     POST /v1/bootcamps/:bootcampId/reviews
// @access    Private
const httpAddReview = asyncHandler(async (req, res, next) => {
  const reviewToAdd = req.body;
  reviewToAdd.user = req.user.id;
  reviewToAdd.bootcamp = req.params.bootcampId;
  const newReview = await addReviewToBootcamp(reviewToAdd);
  // Check if booycamp ID is found and new review is created
  if (newReview) {
    return res.status(201).json({
      success: true,
      data: review,
    });
  } else {
    return next(new ErrorResponse(`No bootcamp found with this ID`, 404));
  }
});

// const httpUpdateReview = asyncHandler(async (req, res, next) => {
//   const reviews = await getAllReviews();
//   res.status(200).json(reviews);
// });

// const httpDeleteReview = asyncHandler(async (req, res, next) => {
//   const reviews = await getAllReviews();
//   res.status(200).json(reviews);
// });

module.exports = {
  httpGetAllReviews,
  httpGetReview,
  httpAddReview,
  httpUpdateReview,
  httpDeleteReview,
};
