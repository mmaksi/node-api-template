const express = require("express");
const {
  httpGetReviews,
  httpGetReview,
  httpAddReview,
  httpUpdateReview,
  httpDeleteReview,
} = require("../controllers/reviews");

const reviewsDatabase = require("../../models/Review.mongo");

const reviewsRouter = express.Router({ mergeParams: true });

const advancedResults = require("../../middleware/advFilters");
const { protect, authorize } = require("../../middleware/auth.middlewareauth");

reviewsRouter.get(
  "/",
  advancedResults(reviewsDatabase, {
    path: "bootcamp",
    select: "name description",
  }),
  httpGetReviews
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
  authorize("user", "admin"),
  httpDeleteReview
);

module.exports = reviewsRouter;
