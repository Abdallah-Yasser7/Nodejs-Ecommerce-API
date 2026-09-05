const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      unique: [true, "Coupon name must be unique"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration date is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
