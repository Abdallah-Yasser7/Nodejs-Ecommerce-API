const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) })
  res.status(201).json({data: category, message: 'Category created successfully'})
})

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;  // 2 - 1 * 10 = 10
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({results: categories.length, data: categories, message: 'Categories fetched successfully'})
})

// @desc    Get a category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return res.status(404).json({message: 'Category not found'});
  }
  res.status(200).json({data: category, message: 'Category fetched successfully'});
});

// @desc    Update a category by ID
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategoryById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
  if (!category) {
    return res.status(404).json({message: 'Category not found'});
  }
  res.status(200).json({data: category, message: 'Category updated successfully'});
});

// @desc    Delete a category by ID
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategoryById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({message: 'Category not found'});
  }
  res.status(200).json({message: 'Category deleted successfully'});
});
