const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orderModel");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const { create } = require("../models/categoryModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrderOnline = async (session) => {
  const cartId = session.client_reference_id;
  const cart = await CartModel.findById(cartId);
  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total;
  // 3 - Create a order
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    shippingAddress,
  });
  // 4 - After creating order, update product quantity and sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
  }
  // 5 - Clear cart
  await CartModel.findByIdAndDelete(cartId);
};

// @desc    Create a new order
// @route   POST /api/v1/orders/:id
// @access  Private/user
exports.createOrderCash = asyncHandler(async (req, res, next) => {
  const { taxPrice, shippingPrice } = req.body;
  const cartId = req.params.cartId;
  // 1 - Get the cart based on the provided cartId
  const cart = await CartModel.findById(cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  // 2 - Get price data from cart to create order
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;
  // 3 - Create a order
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  // 4 - After creating order, update product quantity and sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
  }
  // 5 - Clear cart
  await CartModel.findByIdAndDelete(cartId);
  res.status(201).json({ status: "success", data: order });
});

// @desc    Filter Object
exports.filterObject = asyncHandler(async (req, res, next) => {
  let filterObject = {};
  if (req.user.role === "user") {
    filterObject = { user: req.user._id };
  }
  req.filterObject = filterObject;
  next();
});

// @desc    Get All Orders
// @route   GET /api/v1/orders
// @access  Private/user-admin
exports.getAllOrders = factory.getAll(OrderModel);

// @desc    Get a order by ID
// @route   GET /api/v1/orders/:id
// @access  Private/user-admin
exports.getOrderById = factory.getOne(OrderModel);

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { taxPrice, shippingPrice } = req.body;
  const cartId = req.params.cartId;
  // 1 - Get the cart based on the provided cartId
  const cart = await CartModel.findById(cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  // 2 - Get price data from cart to create order
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const orderPrice = cartPrice + taxPrice + shippingPrice;
  console.log(cartPrice);
  console.log(orderPrice);
  // 3 - Create a checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: orderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/carts`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  })
  res.status(200).json({ status: "success", session });
});

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await createOrderOnline(session);
  }
  res.status(200).json({ received: true });
});