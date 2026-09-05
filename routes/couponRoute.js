const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
} = require("../services/couponServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(protect, allowTo("admin", "manager"), getAllCoupons)
  .post(
    protect,
    allowTo("admin", "manager"),
    createCoupon,
  );
router
  .route("/:id")
  .get(protect, allowTo("admin", "manager"), getCouponById)
  .put(
    protect,
    allowTo("admin", "manager"),
    updateCouponById,
  )
  .delete(protect, allowTo("admin", "manager"), deleteCouponById);

module.exports = router;
