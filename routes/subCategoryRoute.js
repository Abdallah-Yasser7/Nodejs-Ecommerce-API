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
  checkCategoryId,
} = require("../services/subCategryServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .post(
    protect,
    allowTo("admin", "manager"),
    checkCategoryId,
    createSubCategoryValidator(),
    createSubCategory,
  )
  .get(getAllSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator(), getSubCategoryById)
  .put(
    protect,
    allowTo("admin", "manager"),
    updateCategoryValidator(),
    updateSubCategoryById,
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteSubCategoryValidator(),
    deleteSubCategoryById,
  );

module.exports = router;
