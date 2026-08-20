const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMeddleware');
const UserModel = require('../../models/userModel');

exports.getUserValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid user ID format'),
    validatorMiddleware,
  ];
}

exports.createUserValidator = () => {
  return [
    check('name')
      .notEmpty().withMessage('User name is required')
      .isLength({ min: 3 }).withMessage('Too short user name')
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

    check('email')
      .notEmpty().withMessage('User email is required')
      .isEmail().withMessage('Invalid email address')
      .custom(async (val) => {
        const user = await UserModel.findOne({ email: val });
        if (user) {
          throw new Error('Email already in use');
        }
        return true;
      }),

    check('password')
      .notEmpty().withMessage('User password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),

    check('passwordConfirm')
      .notEmpty().withMessage('Password confirmation is required'),

    check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number, only Egyptian and Saudi numbers accepted'),

    check('profileImg').optional(),

    check('role')
      .optional()
      .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),

    validatorMiddleware,
  ];
}

exports.updateUserValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid user ID format'),

    check('name')
      .optional()
      .isLength({ min: 3 }).withMessage('Too short user name')
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

    check('email')
      .optional()
      .isEmail().withMessage('Invalid email address')
      .custom(async (val, { req }) => {
        const user = await UserModel.findOne({ email: val });
        if (user && user._id.toString() !== req.params.id) {
          throw new Error('Email already in use');
        }
        return true;
      }),

    check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number, only Egyptian and Saudi numbers accepted'),

    check('profileImg').optional(),

    check('role')
      .optional()
      .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),

    validatorMiddleware,
  ];
}

exports.changeUserPasswordValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid user ID format'),

    check('currentPassword')
      .notEmpty().withMessage('Current password is required'),

    check('password')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .custom(async (password, { req }) => {
        // user validation
        const user = await UserModel.findById(req.params.id);
        if (!user) {
          throw new Error('User not found');
        }

        // 2- currentPassword is correct
        const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isCorrectPassword) {
          throw new Error('Current password is incorrect');
        }

        // 3- password must be different from current password
        if (password === req.body.currentPassword) {
          throw new Error('New password must be different from current password');
        }

        // 4- password confirmation
        if (password !== req.body.passwordConfirm) {
          throw new Error('Password confirmation does not match new password');
        }

        return true;
      }),

    check('passwordConfirm')
      .notEmpty().withMessage('Password confirmation is required'),

    validatorMiddleware,
  ];
}

exports.deleteUserValidator = () => {
  return [
    check('id').isMongoId().withMessage('Invalid user ID format'),
    validatorMiddleware,
  ];
}