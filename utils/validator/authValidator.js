const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMeddleware");
const UserModel = require("../../models/userModel");

exports.signupValidator = () => {
  return [
    check("name")
      .notEmpty()
      .withMessage("User name is required")
      .isLength({ min: 3 })
      .withMessage("Too short user name")
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

    check("email")
      .notEmpty()
      .withMessage("User email is required")
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (val) => {
        const user = await UserModel.findOne({ email: val });
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      }),

    check("password")
      .notEmpty()
      .withMessage("User password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),

    check("passwordConfirm")
      .notEmpty()
      .withMessage("Password confirmation is required"),

    check("phone")
      .optional()
      .isMobilePhone(["ar-EG", "ar-SA"])
      .withMessage(
        "Invalid phone number, only Egyptian and Saudi numbers accepted",
      ),

    validatorMiddleware,
  ];
};

exports.loginValidator = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("User email is required")
      .isEmail()
      .withMessage("Invalid email address"),

    check("password")
      .notEmpty()
      .withMessage("User password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    validatorMiddleware,
  ];
};
