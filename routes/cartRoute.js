const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  applyCoupon,
} = require("../services/cartServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(protect, allowTo("user"), getCart)
  .post(protect, allowTo("user"), addToCart);
router.route("/clear").delete(protect, allowTo("user"), clearCart);
router.route("/apply-coupon").post(protect, allowTo("user"), applyCoupon);
router
  .route("/:id")
  .put(
    protect,
    allowTo("user"),
    updateQuantity,
  )
  .delete(protect, allowTo("user"), removeFromCart);

module.exports = router;
