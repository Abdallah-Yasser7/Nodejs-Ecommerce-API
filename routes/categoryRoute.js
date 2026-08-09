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
} = require("../services/categoryServices");

router.use("/:categoryId/subcategories", require("./subCategoryRoute"));

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator(), createCategory);
router
  .route("/:id")
  .get(getCategoryValidator(), getCategoryById)
  .put(updateCategoryValidator(), updateCategoryById)
  .delete(deleteCategoryValidator(), deleteCategoryById);

module.exports = router;
