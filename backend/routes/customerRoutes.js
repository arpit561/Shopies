const express = require("express");
const {
  // createCustomer,
  // showAllCustomers,
  getMyCustomers,
  deleteCustomer,
  createOrUpdateCustomer,
  // addUnpaidItemsToCustomer,
  getCustomersByShop,
  getCustomerWithItems,
} = require("../controllers/Customer");
const {
  isShopkeeper,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/createCustomer", authMiddleware, isShopkeeper, createCustomer);
// router.post(
//   "/addUnpaidItemsToCustomer",
//   authMiddleware,
//   isShopkeeper,
//   addUnpaidItemsToCustomer
// );
router.post(
  "/createOrUpdateCustomer",
  authMiddleware,
  isShopkeeper,
  createOrUpdateCustomer
);
router.get("/getCustomersByShop/:shopId", authMiddleware, getCustomersByShop);
router.get(
  "/getMyCustomers/:shopkeeperId",
  authMiddleware,
  isShopkeeper,
  getMyCustomers
);
router.get(
  "/getCustomerWithItems/:customerId",
  authMiddleware,
  isShopkeeper,
  getCustomerWithItems
);
router.delete(
  "/deleteCustomer/:customerId",
  authMiddleware,
  isShopkeeper,
  deleteCustomer
);

module.exports = router;
