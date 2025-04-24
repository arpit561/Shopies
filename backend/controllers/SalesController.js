const Sales = require("../models/Sales");


exports.addOrUpdateMonthlySales = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    const { totalSalesAmount, month } = req.body;
    const {shopId}= req.params;

    if (!totalSalesAmount || !shopId) {
      return res.status(400).json({
        success: false,
        message: "Sales totalSalesAmount and shopId are required",
      });
    }

    // Format the month: "YYYY-MM"
    const now = month ? new Date(month) : new Date();
    const formattedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const updatedSales = await Sales.findOneAndUpdate(
      { shopkeeper: shopkeeperId, shopId, month: formattedMonth },
      { totalSalesAmount: totalSalesAmount },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Monthly sales record added/updated successfully",
      sales: updatedSales,
    });

  } catch (error) {
    console.error("Error in addOrUpdateMonthlySales:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add or update monthly sales",
      error: error.message,
    });
  }
};


exports.getSalesHistory = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    const { shopId } = req.query;

    // Build the query filter
    const filter = { shopkeeper: shopkeeperId };
    if (shopId) {
      filter.shopId = shopId;
    }

    // Fetch sales records sorted by month descending
    const salesHistory = await Sales.find(filter)
      .populate("shopId", "name") // Optional: populate shop name
      .sort({ month: -1 });

    return res.status(200).json({
      success: true,
      sales: salesHistory,
    });

  } catch (error) {
    console.error("Error fetching sales history:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching sales history",
      error: error.message,
    });
  }
};
