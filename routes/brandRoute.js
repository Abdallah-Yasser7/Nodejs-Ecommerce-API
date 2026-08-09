const express = require("express");
const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator");

const {
  getAllBrands,
  createBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById,
} = require("../services/brandServices");

router
  .route("/")
  .get(getAllBrands)
  .post(createBrandValidator(), createBrand);
router
  .route("/:id")
  .get(getBrandValidator(), getBrandById)
  .put(updateBrandValidator(), updateBrandById)
  .delete(deleteBrandValidator(), deleteBrandById);

module.exports = router;
