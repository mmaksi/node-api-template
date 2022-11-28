const {
  getAllReviews,
  getReviewById,
  addReviewToBootcamp,
  getBootcampReviews,
  updateReview,
} = require("../../models/Review.model");
const asyncHandler = require("../../utils/asyncHandler");
const ErrorResponse = require("../../utils/errorResponse");

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
  // Check if bootcamp ID is found and new review is created
  if (newReview) {
    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } else {
    return next(new ErrorResponse(`No bootcamp found with this ID`, 404));
  }
});

// @desc      Update review
// @route     PUT /v1/reviews/:id
// @access    Private
const httpUpdateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  let review = await getReviewById(reviewId);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update this review`, 401));
  }

  review = await updateReview(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Delete review
// @route     DELETE /v1/reviews/:id
// @access    Private
const httpDeleteReview = asyncHandler(async (req, res, next) => {
  const review = await getReviewById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to delete review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

module.exports = {
  httpGetAllReviews,
  httpGetReview,
  httpAddReview,
  httpUpdateReview,
  httpDeleteReview,
};
