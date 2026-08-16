const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  checkCategoryId
} = require("../services/subCategryServices");

router
  .route("/")
  .post(checkCategoryId, createSubCategoryValidator(), createSubCategory)
  .get(getAllSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator(), getSubCategoryById)
  .put(updateCategoryValidator(), updateSubCategoryById)
  .delete(deleteSubCategoryValidator(), deleteSubCategoryById);

module.exports = router;
