const SubCategoryModel = require("../models/subCategoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// @desc    Create a subCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = req.body.category;
  const SubCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res
    .status(201)
    .json({ data: SubCategory, message: "SubCategory created successfully" });
});

// @desc    Get all subCategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit; // 2 - 1 * 10 = 10
  const filter = req.params.categoryId ? { category: req.params.categoryId } : {};
  const subCategories = await SubCategoryModel.find(filter).skip(skip).limit(limit);
  res.status(200).json({
    results: subCategories.length,
    data: subCategories,
    message: "SubCategories fetched successfully",
  });
});

// @desc    Get a subCategory by ID
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const subCategory = await SubCategoryModel.findById(id)
  // .populate({path: "category", select: "name -_id",});
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }
  res
    .status(200)
    .json({ data: subCategory, message: "subCategory fetched successfully" });
});

// @desc    Update a subCategory by ID
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const category = req.body.category;
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category },
    { new: true },
  );
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }
  res
    .status(200)
    .json({ data: subCategory, message: "subCategory updated successfully" });
});

// @desc    Delete a subCategory by ID
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategoryById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("subCategory not found", 404));
  }
  res.status(200).json({ message: "subCategory deleted successfully" });
});
