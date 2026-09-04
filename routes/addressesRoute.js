const express = require("express");
const router = express.Router();
const { protect } = require("../services/authServices");
const { allowTo } = require("../services/authServices");
const {
  addAddress,
  removeAddress,
  getAddresses,
} = require("../services/addressesServices");

const { addAddressValidator, removeAddressValidator } = require("../utils/validator/addressesValidator");

router
  .route("/")
  .post(protect, allowTo("user"), addAddressValidator(), addAddress)
  .get(protect, allowTo("user"), getAddresses);

router
  .route("/:addressId")
  .delete(protect, allowTo("user"), removeAddressValidator(), removeAddress);

module.exports = router;