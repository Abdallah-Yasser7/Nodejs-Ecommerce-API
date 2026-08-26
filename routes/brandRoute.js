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

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(getAllBrands)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator(),
    createBrand,
  );
router
  .route("/:id")
  .get(getBrandValidator(), getBrandById)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator(),
    updateBrandById,
  )
  .delete(protect, allowTo("admin"), deleteBrandValidator(), deleteBrandById);

module.exports = router;
