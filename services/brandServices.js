const BrandModel = require('../models/brandModel');
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMeddleware");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;
  next();
});

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