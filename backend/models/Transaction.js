const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shop", 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now(), 
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
