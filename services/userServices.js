const UserModel = require("../models/userModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMeddleware");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  if (req.file === undefined) return next();
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);

  req.body.profileImg = fileName;
  next();
});

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Private
exports.createUser = factory.createOne(UserModel);

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
exports.getAllUsers = factory.getAll(UserModel);
// @desc    Get a user by ID
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUserById = factory.getOne(UserModel);

// @desc    Update a user by ID
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const document = await UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true },
  );
  if (!document) {
    return next(new ApiError("Document not found", 404));
  }
  res
    .status(200)
    .json({ message: "Document updated successfully", data: document });
});

// @desc    Change user password
// @route   PUT /api/v1/users/change-password/:id
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    { new: true },
  );

  if (!document) {
    return next(
      new ApiError(`No user found with this id: ${req.params.id}`, 404),
    );
  }

  res
    .status(200)
    .json({ data: document, message: "Password changed successfully" });
});

// @desc    Delete a user by ID
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUserById = factory.deleteOne(UserModel);

// @desc    Get logged user data
// @route   GET /api/v1/users/me
// @access  Private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/update-password
// @access  Private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    { new: true },
  );

  const token = createToken(user._id);

  res
    .status(200)
    .json({ token, data: user, message: "Password changed successfully" });
});

// @desc    Update logged user data
// @route   PUT /api/v1/users/update-me
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    { new: true },
  );
  const token = createToken(user._id);
  res
    .status(200)
    .json({ token, data: user, message: "User data updated successfully" });
})

// @desc    Delete logged user data
// @route   DELETE /api/v1/users/delete-me
// @access  Private
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ message: "User deleted successfully" });
});

// @desc    Active logged user
// @route   PUT /api/v1/users/active-me
// @access  Private
exports.activeUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: true });
  res.status(200).json({ message: "User activated successfully" });
});
