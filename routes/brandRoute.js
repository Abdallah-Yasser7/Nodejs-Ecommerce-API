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
  uploadBrandImage,
  resizeBrandImage,
} = require("../services/brandServices");

router
  .route("/")
  .get(getAllBrands)
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator(), createBrand);
router
  .route("/:id")
  .get(getBrandValidator(), getBrandById)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator(), updateBrandById)
  .delete(deleteBrandValidator(), deleteBrandById);

module.exports = router;
