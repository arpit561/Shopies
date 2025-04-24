const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopName: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  // items: [{
  //    type: mongoose.Schema.Types.ObjectId, 
  //    ref: "Item" 
  //   }], // List of Items in the shop
  // transactions: [{ 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: "Transaction" 
  // }], // Transaction history
  customers: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer"
  }],
  createdAt: { 
    type: Date, 
    default: Date.now() 
  },
});

module.exports = mongoose.model("Shop", shopSchema);
