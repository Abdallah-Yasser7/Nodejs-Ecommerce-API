const ReviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

// nested route (get all reviews with productId)
exports.createFilterObject = asyncHandler(async (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
})

// nested route (set product and user ids to create review)
exports.setProductUserIds = asyncHandler(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
})

// @desc    Create a Review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = factory.createOne(ReviewModel);

// @desc    Get all Reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getAllReviews = factory.getAll(ReviewModel);
// @desc    Get a Review by ID
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviewById = factory.getOne(ReviewModel);

// @desc    Update a Review by ID
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReviewById = factory.updateOne(ReviewModel);

// @desc    Delete a Review by ID
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReviewById = factory.deleteOne(ReviewModel);