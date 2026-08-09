const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMeddleware");

exports.getSubCategoryValidator = () => {
  return [
    check("id").isMongoId().withMessage("Invalid subcategory ID format"),
    validatorMiddleware,
  ];
};

exports.createSubCategoryValidator = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("subCategory name is required")
      .isLength({ min: 2, max: 32 })
      .withMessage("Category name must be between 2 and 32 characters"),
    check("category")
      .notEmpty()
      .withMessage("subCategory must belong to a category")
      .isMongoId()
      .withMessage("Invalid category ID format"),
    validatorMiddleware,
  ];
};

exports.updateCategoryValidator = () => {
  return [
    check("id").isMongoId().withMessage("Invalid subCategory ID format"),
    check("name")
      .optional()
      .isLength({ min: 2, max: 32 })
      .withMessage("subCategory name must be between 2 and 32 characters"),
    check("category")
      .optional()
      .isMongoId()
      .withMessage("Invalid category ID format"),
    validatorMiddleware,
  ];
};

exports.deleteSubCategoryValidator = () => {
  return [
    check("id")
      .isMongoId()
      .withMessage("Invalid subCategory ID format")
      .notEmpty()
      .withMessage("subCategory ID is required"),
    validatorMiddleware,
  ];
};
