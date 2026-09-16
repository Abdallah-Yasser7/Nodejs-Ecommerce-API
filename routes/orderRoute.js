const express = require("express");
const router = express.Router();


const {
  createOrderCash,
  getAllOrders,
  filterObject,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(protect, allowTo("user", "admin", "manager"), filterObject, getAllOrders);

router
  .route("/:cartId")
  .post(protect, allowTo("user"), createOrderCash)

router
  .route("/:id")
  .get(protect, allowTo("user", "admin", "manager"), getOrderById);  

router
  .route("/:id/pay")
  .put(protect, allowTo("admin", "manager"), updateOrderToPaid);

router
  .route("/:id/deliver")
  .put(protect, allowTo("admin", "manager"), updateOrderToDelivered);

router
  .route("/checkout-session/:cartId")
  .post(protect, allowTo("user"), checkoutSession);
  
module.exports = router;
