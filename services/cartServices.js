const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");
const asyncHandler = require("express-async-handler");

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
};

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;
  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  // Implementation for adding product to cart
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    const newCart = await cartModel.create({
      user: userId,
      cartItems: [
        { product: productId, color: req.body.color, price: product.price },
      ],
    });
    res
      .status(201)
      .json({ message: "Product added to cart successfully", data: newCart });
  } else {
    const cartItem = cart.cartItems.find(
      (item) =>
        item.product.toString() === productId && item.color === req.body.color,
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color: req.body.color,
        price: product.price,
      });
    }
  }

  const totalPrice = calculateTotalPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res
    .status(200)
    .json({ message: "Product added to cart successfully", data: cart });
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.status(200).json({ data: cart });
});

exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const newCart =await cartModel.findByIdAndUpdate(
    cart._id,
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true },
  );
  const totalPrice = calculateTotalPrice(newCart);
  newCart.totalCartPrice = totalPrice;
  await newCart.save();
  res.status(200).json({ message: "Product removed from cart successfully" });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  await cartModel.findByIdAndUpdate(cart._id, { $set: { cartItems: [], totalCartPrice: 0 } }, { new: true });
  res.status(200).json({ message: "Cart cleared successfully" });
});

exports.updateQuantity = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const cartItem = await cart.cartItems.find((item) => item._id.toString() === req.params.id);
  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }
  cartItem.quantity = req.body.quantity;
  const totalPrice = calculateTotalPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({ message: "Cart item quantity updated successfully" });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { couponName } = req.body;
  const coupon = await couponModel.findOne({ name: couponName, expire: { $gt: Date.now() } });
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found or expired" });
  }
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const discountAmount = cart.totalCartPrice * (coupon.discount / 100);
  cart.totalPriceAfterDiscount = cart.totalCartPrice - discountAmount;
  await cart.save();
  res.status(200).json({ message: "Coupon applied successfully", data: cart });
});