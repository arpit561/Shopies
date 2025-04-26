const express = require("express");
const router = express.Router();
const { createShop, deleteShop, showAllShops , showMyShop} = require("../controllers/ShopController");
const { isShopkeeper, authMiddleware } = require("../middlewares/authMiddleware");

// Create a shop
router.post("/create", authMiddleware, isShopkeeper, createShop);

// Delete a shop
router.delete("/delete/:id", authMiddleware, isShopkeeper, deleteShop);

// Show all shops
router.get("/all", showAllShops);

// Show a shop for a specific owner
router.get("/my-shop", showMyShop);
module.exports = router;

