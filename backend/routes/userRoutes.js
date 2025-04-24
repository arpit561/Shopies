const express = require("express");
const { registerUser, loginUser, sendOtp } = require("../controllers/UserController");

const router = express.Router();

router.post("/sendotp", sendOtp);
router.post("/register", registerUser); // Signup
router.post("/login", loginUser); // Login


module.exports = router;
