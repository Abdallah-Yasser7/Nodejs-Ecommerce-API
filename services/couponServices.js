const couponModel = require('../models/couponModel');
const factory = require("./handlersFactory");

// @desc    Create a coupon
// @route   POST /api/v1/coupons
// @access  Private/admin
exports.createCoupon = factory.createOne(couponModel);

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/admin
exports.getAllCoupons = factory.getAll(couponModel);
// @desc    Get a coupon by ID
// @route   GET /api/v1/coupons/:id
// @access  private/admin
exports.getCouponById = factory.getOne(couponModel);

// @desc    Update a coupon by ID
// @route   PUT /api/v1/coupons/:id
// @access  Private/admin
exports.updateCouponById = factory.updateOne(couponModel);

// @desc    Delete a coupon by ID
// @route   DELETE /api/v1/coupons/:id
// @access  Private/admin
exports.deleteCouponById = factory.deleteOne(couponModel);