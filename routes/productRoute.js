const express = require("express");

const router = express.Router();
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  uploadProductsImage,
  resizeProductImages,
} = require("../services/productServices");

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));

router
  .route("/")
  .get(getAllProducts)
  .post(uploadProductsImage, resizeProductImages, createProductValidator(), createProduct);
router
  .route("/:id")
  .get(getProductValidator(), getProductById)
  .put(uploadProductsImage, resizeProductImages, updateProductValidator(), updateProductById)
  .delete(deleteProductValidator(), deleteProductById);

module.exports = router;
