const express = require("express");
const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validator/userValidator");

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  activeUser,
} = require("../services/userServices");

const { protect, allowTo } = require("../services/authServices");

router
  .route("/")
  .get(protect, allowTo("admin"), getAllUsers)
  .post(
    protect,
    allowTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator(),
    createUser,
  );

router.route("/me").get(protect, getLoggedUserData, getUserById);
router.route("/update-password").put(protect, updateLoggedUserPassword);
router.route("/update-me").put(protect, updateLoggedUserValidator(), updateLoggedUserData);
router.route("/delete-me").delete(protect, deleteLoggedUserData);
router.route("/active").put(allowTo("admin"), activeUser);

router
  .route("/:id")
  .get(protect, allowTo("admin"), getUserValidator(), getUserById)
  .put(
    protect,
    allowTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator(),
    updateUserById,
  )
  .delete(protect, allowTo("admin"), deleteUserValidator(), deleteUserById);

router
  .route("/change-password/:id")
  .put(changeUserPasswordValidator(), changeUserPassword);

module.exports = router;
