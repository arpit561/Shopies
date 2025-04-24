const express = require("express");
const { markItemsAsPaid, addItem, updateItem, deleteItem, getAllItemsByCustomerId, markItemAsPaid } = require("../controllers/ItemController");
const {authMiddleware, isShopkeeper} = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/:customerId/addItem", authMiddleware, isShopkeeper, addItem);
router.put("/updateItem/:itemId", authMiddleware, isShopkeeper, updateItem);
router.delete("/deleteItem/:itemId", authMiddleware, isShopkeeper, deleteItem);
router.get("/find/:customerId", authMiddleware, isShopkeeper, getAllItemsByCustomerId);
router.post("/markItemsAsPaid", authMiddleware, isShopkeeper, markItemsAsPaid);
router.post("/markItemAsPaid", authMiddleware, isShopkeeper, markItemAsPaid);


module.exports = router;
