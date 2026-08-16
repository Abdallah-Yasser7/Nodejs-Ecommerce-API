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
} = require("../services/productServices");

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));

router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator(), createProduct);
router
  .route("/:id")
  .get(getProductValidator(), getProductById)
  .put(updateProductValidator(), updateProductById)
  .delete(deleteProductValidator(), deleteProductById);

module.exports = router;
