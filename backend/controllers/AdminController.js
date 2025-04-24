const User = require("../models/User");
const Shop = require("../models/Shop");
const Customer = require("../models/Customer");

// 1. Get all shopkeepers
exports.getAllShopkeepers = async (req, res) => {
  try {
    const shopkeepers = await User.find({ role: "shopkeeper" }).select("-password");

    return res.status(200).json({
      success: true,
      shopkeepers,
    });
  } catch (error) {
    console.error("Error fetching shopkeepers:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching shopkeepers",
      error: error.message,
    });
  }
};

// 2. Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner", "name email");

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching shops",
      error: error.message,
    });
  }
};

// 3. Delete a shop by ID
exports.deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    await shop.deleteOne(); // Optionally cascade delete related customers/items

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting shop",
      error: error.message,
    });
  }
};


exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("createdBy", "name email")
      .populate("unpaidItems");

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

// Block/unblock
exports.toggleShopkeeperStatus = async (req, res) => {
  try {
    const { shopkeeperId } = req.params;
    console.log(shopkeeperId);

    const user = await User.findById(shopkeeperId);
    if (!user || user.role !== "shopkeeper") {
      return res.status(404).json({
        success: false,
        message: "Shopkeeper not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Shopkeeper account has been ${user.isActive ? "unblocked" : "blocked"}`,
      shopkeeper: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error toggling shopkeeper status:", error);
    return res.status(500).json({
      success: false,
      message: "Error toggling shopkeeper status",
      error: error.message,
    });
  }
};


exports.getBlockedShopkeepers = async (req, res) => {
  try {
    const blockedShopkeepers = await User.find({
      role: "shopkeeper",
      isActive: false,
    }).select("-password"); // exclude sensitive info like password

    return res.status(200).json({
      success: true,
      count: blockedShopkeepers.length,
      blockedShopkeepers,
    });
  } catch (error) {
    console.error("Error fetching blocked shopkeepers:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching blocked shopkeepers",
      error: error.message,
    });
  }
};
