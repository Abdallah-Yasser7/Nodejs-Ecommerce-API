const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uploadMultipleImages } = require("../middlewares/uploadImageMeddleware");

exports.uploadProductsImage = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  const imageCoverFileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-cover.jpeg`;

  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (document, index) => {
        const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${index + 1}.jpeg`;
        await sharp(document.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);

        req.body.images.push(fileName);
      }),
    );
  }
  next();
});

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(ProductModel);

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = factory.getAll(ProductModel);

// @desc    Get a product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = factory.getOne(ProductModel, { path: "reviews" });

// @desc    Update a product by ID
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProductById = factory.updateOne(ProductModel);

// @desc    Delete a product by ID
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProductById = factory.deleteOne(ProductModel);
