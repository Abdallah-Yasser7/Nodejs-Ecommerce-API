const express = require("express");
const router = express.Router();
const { signupValidator, loginValidator } = require("../utils/validator/authValidator");

const { signup, login, forgotPassword, verifyPasswordResetCode, resetPassword } = require("../services/authServices");

router.route("/signup").post(signupValidator(), signup);
router.route("/login").post(loginValidator(), login);
router.route("/forget-password").post(forgotPassword);
router.route("/verify-password").post(verifyPasswordResetCode);
router.route("/reset-password").put(resetPassword);

module.exports = router;
