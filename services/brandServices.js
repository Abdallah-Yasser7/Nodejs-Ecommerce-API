const BrandModel = require('../models/brandModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError');

// @desc    Create a brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const brand = await BrandModel.create({ name, slug: slugify(name) })
  res.status(201).json({data: brand, message: 'brand created successfully'})
})

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;  // 2 - 1 * 10 = 10
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({results: brands.length, data: brands, message: 'Brands fetched successfully'})
})

// @desc    Get a brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrandById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError('brand not found', 404));
  }
  res.status(200).json({data: brand, message: 'Brand fetched successfully'});
});

// @desc    Update a brand by ID
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateBrandById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const brand = await BrandModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
  if (!brand) {
    return next(new ApiError('Brand not found', 404));
  }
  res.status(200).json({data: brand, message: 'Brand updated successfully'});
});

// @desc    Delete a brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrandById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError('Brand not found', 404));
  }
  res.status(200).json({message: 'Brand deleted successfully'});
});
