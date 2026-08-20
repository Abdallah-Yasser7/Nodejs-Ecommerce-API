const express = require("express");
const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator
} = require("../utils/validator/userValidator");

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword
} = require("../services/userServices");

router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator(), createUser);
router
  .route("/:id")
  .get(getUserValidator(), getUserById)
  .put(uploadUserImage, resizeUserImage,updateUserValidator(), updateUserById)
  .delete(deleteUserValidator(), deleteUserById);

router
  .route("/change-password/:id")
  .put(changeUserPasswordValidator(), changeUserPassword);

module.exports = router;
