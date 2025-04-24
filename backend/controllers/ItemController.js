
const Item = require("../models/Item");
const Customer = require("../models/Customer");

// exports.addItem = async (req, res) => {
//   try {
//     const { customerId } = req.params;  // Get customerId from URL params
//     const { itemName, price, dateTaken, paid } = req.body;  // Get item details from request body

//     // Check if customer exists
//     const customer = await Customer.findById(customerId);
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     // Create a new item and associate it with the customer
//     const newItem = new Item({
//       customerId,
//       itemName,
//       price,
//       dateTaken,
//       paid,
//     });

//     // Save the item
//     await newItem.save();

//     // Add the new item to the customer's unpaidItems array (optional)
//     customer.unpaidItems.push(newItem._id);
//     await customer.save();

//     return res.status(201).json({
//       success: true,
//       message: "Item added to customer",
//       item: newItem,
//     });
//   } catch (error) {
//     console.error("Error adding item:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error adding item",
//     });
//   }
// };


exports.addItem = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { itemName, price, dateTaken, paid } = req.body;
    const shopkeeperId = req.user.id; // Assuming shopkeeper is logged in

    if (!customerId || !itemName || !price) {
      return res.status(400).json({
        success: false,
        message: "CustomerId, itemName, and price are required fields",
      });
    }

    // Find the customer to check if they belong to the logged-in shopkeeper
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Ensure the customer belongs to the shopkeeper (user who is logged in)
    if (customer.createdBy.toString() !== shopkeeperId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add items to this customer",
      });
    }

    // Ensure customer has a shopId
    const shopId = customer.shopId;
    console.log("shopId: ", shopId);
    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Customer does not have a shopId associated",
      });
    }

    // Create the item
    const newItem = new Item({
      customerId,
      itemName,
      price,
      dateTaken,
      paid: paid || false,
      shopId, // Set the shopId here
    });

    await newItem.save();

    // Add the new item to the customer's unpaidItems array
    customer.unpaidItems.push(newItem._id);
    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding item",
      error: error.message,
    });
  }
};




exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;  // Get itemId from URL params
    const { itemName, price, dateTaken, paid } = req.body;  // Get updated details from request body

    // Find the item by ID
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Update item fields
    item.itemName = itemName || item.itemName;
    item.price = price || item.price;
    item.dateTaken = dateTaken || item.dateTaken;
    item.paid = paid !== undefined ? paid : item.paid;

    // Save the updated item
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating item",
    });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;  // Get itemId from URL params

    // Find the item by ID
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Remove the item from the associated customer’s unpaidItems array
    const customer = await Customer.findById(item.customerId);
    if (customer) {
      customer.unpaidItems = customer.unpaidItems.filter(item => item.toString() !== itemId);
      await customer.save();
    }

    // Delete the item
    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting item",
    });
  }
};


exports.getAllItemsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;  // Get customerId from URL params

    // Find the customer with the given customerId
    const customer = await Customer.findById(customerId).exec();
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Use the unpaidItems array from the customer
    const itemIds = customer.unpaidItems; // Assuming unpaidItems contain the ObjectId references of items

    // Find all items associated with the unpaidItems of this customer
    const items = await Item.find({ _id: { $in: itemIds } }).exec();

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching items",
    });
  }
};


exports.markItemAsPaid = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "itemId is required",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Fetch the customer who has this item
    const customer = await Customer.findOne({ unpaidItems: item._id });
    if (!customer || customer.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark this item as paid",
      });
    }

    // Mark the item as paid
    item.paid = true;
    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item marked as paid",
      item,
    });

  } catch (error) {
    console.error("Error in markItemAsPaid:", error);
    return res.status(500).json({
      success: false,
      message: "Error while marking item as paid",
      error: error.message,
    });
  }
};



exports.markItemsAsPaid = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "itemIds array is required",
      });
    }

    // Find all the items with the provided itemIds
    const items = await Item.find({ _id: { $in: itemIds } });

    if (items.length !== itemIds.length) {
      return res.status(404).json({
        success: false,
        message: "Some items not found",
      });
    }

    // Check if the items belong to the logged-in user's customers
    const shopkeeperId = req.user.id;
    const invalidItems = items.filter(item => item.customerId.createdBy.toString() !== shopkeeperId);

    if (invalidItems.length > 0) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark some of these items as paid",
      });
    }

    // Mark the items as paid
    const updatedItems = await Item.updateMany(
      { _id: { $in: itemIds } },
      { $set: { paid: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Selected items marked as paid",
      modifiedCount: updatedItems.modifiedCount,
    });

  } catch (error) {
    console.error("Error in markItemsAsPaid:", error);
    return res.status(500).json({
      success: false,
      message: "Error while marking items as paid",
      error: error.message,
    });
  }
};


