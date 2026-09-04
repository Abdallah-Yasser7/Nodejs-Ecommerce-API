const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMeddleware');

exports.addAddressValidator = () => {
  return [
    check('name')
      .notEmpty().withMessage('Address name is required'),

    check('phone')
      .notEmpty().withMessage('Phone is required')
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number, only Egyptian and Saudi numbers accepted'),

    check('address')
      .notEmpty().withMessage('Address is required'),

    check('city')
      .notEmpty().withMessage('City is required'),

    check('postalcode')
      .optional()
      .isPostalCode('any').withMessage('Invalid postal code format'),

    check('isDefault')
      .optional()
      .isBoolean().withMessage('isDefault must be true or false'),

    validatorMiddleware,
  ];
}

exports.removeAddressValidator = () => {
  return [
    check('addressId').isMongoId().withMessage('Invalid address ID format'),
    validatorMiddleware,
  ];
}