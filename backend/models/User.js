const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: {
     type: String, 
     unique: true 
    },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ["admin", "shopkeeper", "customer"],
    default: "customer",
    required: true,
  },
  image: {
    type: String,
    required: true,
    // default: function () {
    //   return `https://api.dicebear.com/5.x/initials/svg?seed=${this.name}`;
    // },
  },
  shop: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shop" 
  }], // Only for Shopkeepers
  isActive: {
    type: Boolean,
    default: true, // Active by default
  },
  transactions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Transaction" 
  }], // Customer Transactions
  createdAt: { 
    type: Date, 
    default: Date.now() 
  },
});

module.exports = mongoose.model("User", userSchema);
