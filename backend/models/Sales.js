const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  shopkeeper: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },
  month: {
    type: String, // Format: "2025-04"
    required: true,
  },
  totalSalesAmount: {
    type: Number,
    required: true,
    default: 0
  }
});

// Ensure only one entry per month per shop per shopkeeper
salesSchema.index({ shopkeeper: 1, shopId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Sales", salesSchema);
