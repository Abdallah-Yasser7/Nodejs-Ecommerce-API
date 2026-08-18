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

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));

router
  .route("/")
  .get(getAllCategories)
  .post(uploadCategoryImage, resizeCategoryImage, createCategoryValidator(), createCategory);
router
  .route("/:id")
  .get(getCategoryValidator(), getCategoryById)
  .put(uploadCategoryImage, resizeCategoryImage,updateCategoryValidator(), updateCategoryById)
  .delete(deleteCategoryValidator(), deleteCategoryById);

module.exports = router;
