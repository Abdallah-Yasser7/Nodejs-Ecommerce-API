const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require('../services/categoryServices');

router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').get(getCategoryById).put(updateCategoryById).delete(deleteCategoryById);

module.exports = router;