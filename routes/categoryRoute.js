const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../services/categoryServices');

router.get('/', getAllCategories);

module.exports = router;