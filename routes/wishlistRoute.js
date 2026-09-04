const express = require("express");
const router = express.Router();
const { protect } = require("../services/authServices");
const { allowTo } = require("../services/authServices");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
} = require("../services/wishlistServices");

router
  .route("/")
  .post(protect, allowTo("user"), addProductToWishlist)
  .get(protect, allowTo("user"), getWishlist)

router
  .route("/:productId")
  .delete(protect, allowTo("user"), removeProductFromWishlist);

module.exports = router;
