const mongoose = require('mongoose');

// 1- create a schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: [ true, 'Category name must be unique'],
    maxlength: [32, 'Category name must be less than 32 characters'],
    minlength: [3, 'Category name must be at least 3 characters']
  },
  // slug is a URL-friendly A AND B => shoping.com/category/a-and-b
  slug: {
    type: String,
    lowercase: true
  },
  image: String,
}, { timestamps: true })

// 2- mongoose middleware
categorySchema.post('init', (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
});

categorySchema.post('save', (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
});

// 3- create a model
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;