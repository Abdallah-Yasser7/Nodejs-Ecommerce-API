const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(ProductModel);

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = factory.getAll(ProductModel)

// @desc    Get a product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = factory.getOne(ProductModel);

// @desc    Update a product by ID
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProductById = factory.updateOne(ProductModel);

// @desc    Delete a product by ID
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProductById = factory.deleteOne(ProductModel);