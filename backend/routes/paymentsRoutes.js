const express = require("express");
const router = express.Router();
const { createOrder, verifyAndCreateTransaction } = require("../controllers/Payments");
const { authMiddleware, isCustomer } = require("../middlewares/authMiddleware");

router.post("/create-order", authMiddleware, isCustomer ,createOrder);
router.post("/verify-payment", authMiddleware, verifyAndCreateTransaction);

module.exports = router;
