const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMeddleware');
const ReviewModel = require('../../models/reviewModel');

exports.getReviewValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid review ID format'),
    validatorMiddleware,
  ];
}

exports.createReviewValidator = () => {
  return [
    check('review')
      .notEmpty().withMessage('Review can not be empty'),

    check('rating')
      .notEmpty().withMessage('Rating is required')
      .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0'),

    check('product')
      .notEmpty().withMessage('Review must belong to a product')
      .isMongoId().withMessage('Invalid product ID format')
      .custom(async (productId, { req }) => {
        const existingReview = await ReviewModel.findOne({
          product: productId,
          user: req.user._id, //req.user._id from protect middleware
        });
        if (existingReview) {
          throw new Error('You have already reviewed this product');
        }
        return true;
      }),

    check('user')
      .isMongoId().withMessage('Invalid user ID format'),

    validatorMiddleware,
  ];
}

exports.updateReviewValidator = () => {
  return [
    check('id')
      .isMongoId().withMessage('Invalid review ID format')
      .custom(async (reviewId, { req }) => {
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error('You are not allowed to edit this review');
        }
        return true;
      }),

    check('review')
      .optional()
      .notEmpty().withMessage('Review can not be empty'),

    check('rating')
      .optional()
      .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0'),

    validatorMiddleware,
  ];
}

exports.deleteReviewValidator = () => {
  return [
    check('id')
      .isMongoId().withMessage('Invalid review ID format')
      .custom(async (reviewId, { req }) => {
        if (req.user.role === "admin" || req.user.role === "manager") {
          return true;
        }
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
          throw new Error('Review not found');
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error('You are not allowed to delete this review');
        }
        return true;
      }),

    validatorMiddleware,
  ];
}