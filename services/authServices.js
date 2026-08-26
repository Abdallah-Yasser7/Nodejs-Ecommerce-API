const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

// @desc    Create a user
// @route   POST /api/v1/auth
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });
  // 2- Generate token
  const token = createToken(user._id);
  // 3- Send response
  res.status(201).json({ token, data: user });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1- Check if user exists && password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 2- Generate token
  const token = createToken(user._id);
  // 3- Send response
  res.status(200).json({ token, data: user });
});

// @desc    Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in! Please log in", 401));
  }
  // 2- Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3- Check if user still exists
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists", 401),
    );
  }
  if (currentUser.active === false) {
    return next(new ApiError("Your account has been deactivated", 401));
  }
  // 4- Check if user changed password after the token was issued
  if (
    currentUser.passwordChangeAt &&
    parseInt(currentUser.passwordChangeAt.getTime() / 1000, 10) > decoded.iat
  ) {
    return next(
      new ApiError("User recently changed password! Please log in again", 401),
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});

// @desc    Restrict to specific roles
exports.allowTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forget-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- Check if user exists
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with email address", 404));
  }
  // 2- Generate the random reset code
  const resetCode = crypto.randomInt(100000, 999999).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},\n\nWe received a request to reset the password for your account.\n\nYour password reset code is: ${resetCode}\n\nThis code is valid for 10 minutes only.\n\nIf you didn't request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There was an error sending the email", 500));
  }
  // 3- Send it to user's email
  res.status(200).json({ status: 'success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verify-password
// @access  Public
exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: 'success', message: 'Password reset code verified' });
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ApiError("There is no user with email address", 404));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Password reset code not verified", 400));
  }
  user.password = req.body.password;
  user.passwordChangeAt = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ status: 'success', token, message: 'Password reset successful' });
})
