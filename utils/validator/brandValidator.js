const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMeddleware');

exports.getBrandValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid brand ID format'),
    validatorMiddleware,
  ];
}

exports.createBrandValidator = () => {
  return [
    check('name').notEmpty().withMessage('brand name is required')
    .isLength({ min: 2, max: 32 }).withMessage('brand name must be between 2 and 32 characters'),
    validatorMiddleware,
  ];
}

exports.updateBrandValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid brand ID format'),
    check('name').optional().isLength({ min: 2, max: 32 }).withMessage('brand name must be between 2 and 32 characters'),
    validatorMiddleware,
  ];
}

exports.deleteBrandValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid brand ID format'),
    validatorMiddleware,
  ];
}
