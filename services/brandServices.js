const BrandModel = require('../models/brandModel');
const factory = require("./handlersFactory");

// @desc    Create a brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = factory.getAll(BrandModel);
// @desc    Get a brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrandById = factory.getOne(BrandModel);

// @desc    Update a brand by ID
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrandById = factory.updateOne(BrandModel);

// @desc    Delete a brand by ID
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrandById = factory.deleteOne(BrandModel);