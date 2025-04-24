const express = require("express");
const router = express.Router();
const { createTransaction, getAllTransactions } = require("../controllers/TransactionController");
const { authMiddleware, isCustomer } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, isCustomer, createTransaction);
router.get("/all", authMiddleware, getAllTransactions);

module.exports = router;

