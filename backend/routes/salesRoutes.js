const express = require("express");
const { addOrUpdateMonthlySales, getSalesHistory } = require("../controllers/SalesController");
const {authMiddleware, isShopkeeper} = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/monthlyRecords/:shopId", authMiddleware, isShopkeeper, addOrUpdateMonthlySales);

// Route to get sales history
router.get("/historyRecords", authMiddleware, isShopkeeper, getSalesHistory);

module.exports = router;
