const express = require("express");
const {
  httpGetAllReviews,
  httpGetReview,
  httpAddReview,
  httpUpdateReview,
  httpDeleteReview,
} = require("./reviews.controller.js");

const reviewsDatabase = require("../../models/Review.mongo");

const reviewsRouter = express.Router({ mergeParams: true });

const advancedResults = require("../../middleware/advFilters");
const { protect, authorize } = require("../../middleware/auth.middleware");

reviewsRouter.get(
  "/",
  advancedResults(reviewsDatabase, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetAllReviews
);
reviewsRouter.get("/:id", httpGetReview);
reviewsRouter.post("/", protect, authorize("user", "admin"), httpAddReview);
reviewsRouter.put(
  "/:id",
  protect,
  authorize("user", "admin"),
  httpUpdateReview
);
reviewsRouter.delete(
  "/:id",
  protect,
  // authorize("user", "admin"),
  httpDeleteReview
);

module.exports = reviewsRouter;
