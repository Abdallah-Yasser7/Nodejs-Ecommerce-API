const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phoneNumber: String,
    },
    totalOrderPrice: Number,
    orderStatus: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Cash"],
      default: "Cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);

orderSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email phone profileImg",
  }).populate({
    path: "cartItems.product",
    select: "name imageCover",
  });
});

module.exports = mongoose.model("Order", orderSchema);
