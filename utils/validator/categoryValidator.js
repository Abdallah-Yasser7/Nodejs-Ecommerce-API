const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMeddleware');

exports.getCategoryValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid category ID format'),
    validatorMiddleware,
  ];
}

exports.createCategoryValidator = () => {
  return [
    check('name').notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 32 }).withMessage('Category name must be between 3 and 32 characters'),
    validatorMiddleware,
  ];
}

exports.updateCategoryValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid category ID format'),
    check('name').optional().isLength({ min: 3, max: 32 }).withMessage('Category name must be between 3 and 32 characters'),
    validatorMiddleware,
  ];
}

exports.deleteCategoryValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid category ID format'),
    validatorMiddleware,
  ];
}
