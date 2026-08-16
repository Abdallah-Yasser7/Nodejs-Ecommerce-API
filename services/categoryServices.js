const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");


// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(CategoryModel);

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = factory.getAll(CategoryModel);

// @desc    Get a category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategoryById = factory.getOne(CategoryModel);

// @desc    Update a category by ID
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategoryById = factory.updateOne(CategoryModel);

// @desc    Delete a category by ID
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategoryById = factory.deleteOne(CategoryModel);
