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

// 2- mongoose middleware
brandSchema.post('init', (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
});

brandSchema.post('save', (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
});

// 3- create a model
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;