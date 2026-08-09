const mongoose = require('mongoose');

// 1- create a schema
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a brand name'],
    unique: [ true, 'brand name must be unique'],
    maxlength: [32, 'brand name must be less than 32 characters'],
    minlength: [2, 'brand name must be at least 2 characters']
  },
  slug: {
    type: String,
    lowercase: true
  },
  image: String,
}, { timestamps: true })

// 2- create a model
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;