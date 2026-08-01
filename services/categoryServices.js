const CategoryModel = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
  const name = req.body.name;
  const newCategory = new CategoryModel({ name });
  await newCategory.save().then((doc) => {
    res.json(doc)
  }).catch((err) => {
    res.json(err)
  });
}