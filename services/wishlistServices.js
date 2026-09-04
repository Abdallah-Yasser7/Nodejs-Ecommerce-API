const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc   Add a product to the user's wishlist
// @route  POST /api/v1/wishlist
// @access Private
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: productId } },
    { new: true },
  );
  res.status(200).json({ message: "Product added to wishlist successfully", data: productId });
});

// @desc   Remove a product from the user's wishlist
// @route  DELETE /api/v1/wishlist/:productId
// @access Private
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true },
  );
  res.status(200).json({ message: "Product removed from wishlist successfully", data: productId });
});

// @desc   Get the user's wishlist
// @route  GET /api/v1/wishlist
// @access Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId).populate({ path: "wishlist" });
  res.status(200).json({ message: "Wishlist retrieved successfully", data: user.wishlist });
});
