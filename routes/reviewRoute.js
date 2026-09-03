const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/reviewValidator");

const {
  getAllReviews,
  createReview,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  createFilterObject,
  setProductUserIds,
} = require("../services/reviewServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(createFilterObject, getAllReviews)
  .post(protect, allowTo("user"), setProductUserIds, createReviewValidator(), createReview);
router
  .route("/:id")
  .get(getReviewValidator(), getReviewById)
  .put(protect, allowTo("user"), updateReviewValidator(), updateReviewById)
  .delete(protect, allowTo("user", "admin", "manager"), deleteReviewValidator(), deleteReviewById);

module.exports = router;
