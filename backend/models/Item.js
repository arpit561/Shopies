const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // customerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Customer",
  //   required: true,
  // },
  itemName: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  dateTaken: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false
  },
  // shopId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Shop",
  //   required: true, // Ensure this field is required for an item
  // }
 
});

module.exports = mongoose.model("Item", itemSchema);
