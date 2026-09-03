const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");


// nested route (create subCategory with categoryId)
exports.checkCategoryId = asyncHandler(async (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
});

// nested route (get all subCategories with categoryId)
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
}

// @desc    Create a subCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategoryModel);

// @desc    Get all subCategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getAllSubCategories = factory.getAll(SubCategoryModel);

// @desc    Get a subCategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategoryById = factory.getOne(SubCategoryModel);
// @desc    Update a subCategory by ID
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategoryById = factory.updateOne(SubCategoryModel);

// @desc    Delete a subCategory by ID
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategoryById = factory.deleteOne(SubCategoryModel);

