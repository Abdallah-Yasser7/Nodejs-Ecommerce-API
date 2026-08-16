const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: [true, 'Product name must be unique'],
    trim: true,
    minlength: [3, 'Too short product name'],
    maxlength: [100, 'Too long product name'],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    minlength: [10, 'Too short product description'],
    maxlength: [500, 'Too long product description'],
  },
  quantity: {
    type: Number,
    required: [ true, 'Product quantity is required'],
  },
  price: {
    type: Number,
    required: [ true, 'Product price is required'],
    trim: true,
    min: [0, 'Product price must be above or equal 0'],
    max: [200000, 'Product price must be below or equal 200000'],
  },
  priceAfterDiscount: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0,
  },
  imageCover: {
    type: String,
    required: [true, 'Product image cover is required'],
  },
  images: [String],
  color: {
    type: [String],
  },
  ratingsAverage: {
    type: Number,
    min: [1, 'Rating must be above or equal 1.0'],
    max: [5, 'Rating must be below or equal 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
  },
  subCategory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SubCategory',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
}, { timestamps: true });

// Mongoose Query Middleware
productSchema.pre(/^find/, function () {
  this.populate({
    path: "category",
    select: "name"
  })
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;