const express = require("express");
const router = express.Router();
const {
  getAllShopkeepers,
  getAllShops,
  deleteShop,
  toggleShopkeeperStatus,
  getBlockedShopkeepers,
} = require("../controllers/AdminController");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Admin-protected routes
router.get("/shopkeepers", authMiddleware, isAdmin, getAllShopkeepers);
router.get("/shops", authMiddleware, isAdmin, getAllShops);
router.delete("/shopDelete/:shopId", authMiddleware, isAdmin, deleteShop);
router.put("/toggle-shopkeeper/:shopkeeperId",authMiddleware, isAdmin, toggleShopkeeperStatus);
router.get("/shopkeepers/blocked",authMiddleware, isAdmin, getBlockedShopkeepers);


module.exports = router;

