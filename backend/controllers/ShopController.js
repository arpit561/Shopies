const Shop = require("../models/Shop");

// Create a new Shop
exports.createShop = async (req, res) => {
  try {
    const { shopName, address } = req.body;
    const userId = req.user.id;

    if (!shopName || !address) {
      return res.status(400).json({
        success: false,
        message: "Shop name and address are required",
      });
    }

    // // Prevent duplicate shop for the same user
    // const existingShop = await Shop.findOne({ owner: userId });
    // if (existingShop) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You already have a shop registered",
    //   });
    // }

    const shop = await Shop.create({
      shopName,
      address,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.error("Error creating shop:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a shop by ID (Only by owner)
exports.deleteShop = async (req, res) => {
  try {
    const shopId = req.params.id;
    const userId = req.user.id;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this shop",
      });
    }

    await Shop.findByIdAndDelete(shopId);

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shop:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Show all shops (admin or public)
exports.showAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner", "name email").populate("customers", "name contactInfo");

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

