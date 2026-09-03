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

const { protect, allowTo } = require("../services/authServices");

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));
router.use("/:productId/reviews", require("./reviewRoute"));

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadProductsImage,
    resizeProductImages,
    createProductValidator(),
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator(), getProductById)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadProductsImage,
    resizeProductImages,
    updateProductValidator(),
    updateProductById,
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteProductValidator(),
    deleteProductById,
  );

module.exports = router;
