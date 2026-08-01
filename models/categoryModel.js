const mongoose = require('mongoose');

// 1- create a schema
const categorySchema = new mongoose.Schema({
  name: String,
})

// 2- create a model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;