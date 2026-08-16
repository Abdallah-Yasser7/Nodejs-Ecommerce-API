const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMeddleware");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");
const ProductModel = require("../../models/productModel");

exports.getProductValidator = () => {
  return [
    check("id").isMongoId().withMessage("Invalid product ID format"),
    validatorMiddleware,
  ];
};

exports.createProductValidator = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ min: 3, max: 100 })
      .withMessage("Product name must be between 3 and 100 characters"),

    check("description")
      .notEmpty()
      .withMessage("Product description is required")
      .isLength({ min: 10, max: 500 })
      .withMessage("Product description must be between 10 and 500 characters"),

    check("quantity")
      .notEmpty()
      .withMessage("Product quantity is required")
      .isNumeric()
      .withMessage("Product quantity must be a number"),

    check("price")
      .notEmpty()
      .withMessage("Product price is required")
      .isNumeric()
      .withMessage("Product price must be a number")
      .isFloat({ min: 0, max: 200000 })
      .withMessage("Product price must be between 0 and 200000"),

    check("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("Product priceAfterDiscount must be a number")
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price && value >= req.body.price) {
          throw new Error("priceAfterDiscount must be lower than price");
        }
        return true;
      }),

    check("imageCover")
      .notEmpty()
      .withMessage("Product image cover is required"),

    check("images")
      .optional()
      .isArray()
      .withMessage("Images must be an array of strings"),

    check("color")
      .optional()
      .isArray()
      .withMessage("Color must be an array of strings"),

    check("category")
      .notEmpty()
      .withMessage("Product category is required")
      .isMongoId()
      .withMessage("Invalid category ID format")
      .custom(async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
          throw new Error("Category not found");
        }
        return true;
      }),

    check("subCategory")
      .optional()
      .isArray()
      .withMessage("SubCategory must be an array of IDs"),

    check("subCategory.*")
      .optional()
      .isMongoId()
      .withMessage("Invalid subCategory ID format")
      .custom(async (subCategoryId, { req }) => {
        const subCategory = await SubCategoryModel.findById(subCategoryId);
        if (!subCategory) {
          throw new Error("SubCategory not found");
        }
        if (subCategory.category.toString() !== req.body.category) {
          throw new Error(
            `SubCategory ${subCategoryId} does not belong to the selected category`,
          );
        }
        return true;
      }),

    check("brand")
      .optional()
      .isMongoId()
      .withMessage("Invalid brand ID format"),

    check("ratingsAverage")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1.0 and 5.0"),

    check("ratingsQuantity")
      .optional()
      .isNumeric()
      .withMessage("ratingsQuantity must be a number"),

    validatorMiddleware,
  ];
};

exports.updateProductValidator = () => {
  return [
    check("id").isMongoId().withMessage("Invalid product ID format"),

    check("name")
      .optional()
      .isLength({ min: 3, max: 100 })
      .withMessage("Product name must be between 3 and 100 characters"),

    check("description")
      .optional()
      .isLength({ min: 10, max: 500 })
      .withMessage("Product description must be between 10 and 500 characters"),

    check("quantity")
      .optional()
      .isNumeric()
      .withMessage("Product quantity must be a number"),

    check("price")
      .optional()
      .isNumeric()
      .withMessage("Product price must be a number")
      .isFloat({ min: 0, max: 200000 })
      .withMessage("Product price must be between 0 and 200000"),

    check("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("Product priceAfterDiscount must be a number")
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price && value >= req.body.price) {
          throw new Error("priceAfterDiscount must be lower than price");
        }
        return true;
      }),

    check("category")
      .optional()
      .isMongoId()
      .withMessage("Invalid category ID format")
      .custom(async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
          throw new Error("Category not found");
        }
        return true;
      }),
    ,
    check("subCategory")
      .optional()
      .isArray()
      .withMessage("SubCategory must be an array of IDs"),

    check("subCategory.*")
      .optional()
      .isMongoId()
      .withMessage("Invalid subCategory ID format")
      .custom(async (subCategoryId, { req }) => {
        const subCategory = await SubCategoryModel.findById(subCategoryId);
        if (!subCategory) {
          throw new Error("SubCategory not found");
        }

        let categoryId = req.body.category;

        if (!categoryId) {
          const product = await ProductModel.findById(req.params.id);
          if (!product) {
            throw new Error("Product not found");
          }
          categoryId = product.category.toString();
        }

        if (subCategory.category.toString() !== categoryId) {
          throw new Error(
            `SubCategory ${subCategoryId} does not belong to the selected category`,
          );
        }
        return true;
      }),

    check("brand")
      .optional()
      .isMongoId()
      .withMessage("Invalid brand ID format"),

    validatorMiddleware,
  ];
};

exports.deleteProductValidator = () => {
  return [
    check("id").isMongoId().withMessage("Invalid product ID format"),
    validatorMiddleware,
  ];
};
