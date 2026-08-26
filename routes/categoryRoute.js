const express = require("express");
const router = express.Router();

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");

const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/categoryServices");

const { protect, allowTo } = require("../services/authServices");

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));

router
  .route("/")
  .get(getAllCategories)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator(),
    createCategory,
  );
router
  .route("/:id")
  .get(getCategoryValidator(), getCategoryById)
  .put(
    protect,
    allowTo("admin", "manager"),

    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator(),
    updateCategoryById,
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteCategoryValidator(),
    deleteCategoryById,
  );

module.exports = router;
