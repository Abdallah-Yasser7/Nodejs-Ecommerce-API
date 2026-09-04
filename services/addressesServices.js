const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc   Add an address to the user's addresses
// @route  POST /api/v1/addresses
// @access Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const addressData = req.body;
  await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { addresses: addressData } },
    { new: true },
  );
  res.status(200).json({ message: "Address added successfully", data: addressData });
});

// @desc   Remove an address from the user's addresses
// @route  DELETE /api/v1/addresses/:addressId
// @access Private
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const addressId = req.params.addressId;
  await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { addresses: { _id: addressId } } },
    { new: true },
  );
  res.status(200).json({ message: "Address removed successfully", data: addressId });
});

// @desc   Get the user's addresses
// @route  GET /api/v1/addresses
// @access Private
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId).populate({ path: "addresses" });
  res.status(200).json({ message: "Addresses retrieved successfully", data: user.addresses });
});
