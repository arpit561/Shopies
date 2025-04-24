const express = require("express");
const router = express.Router();
const { createShop, deleteShop, showAllShops } = require("../controllers/ShopController");
const { isShopkeeper, authMiddleware } = require("../middlewares/authMiddleware");

// Create a shop
router.post("/create", authMiddleware, isShopkeeper, createShop);

// Delete a shop
router.delete("/delete/:id", authMiddleware, isShopkeeper, deleteShop);

// Show all shops
router.get("/all", showAllShops);

module.exports = router;

