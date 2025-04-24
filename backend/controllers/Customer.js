const Customer = require("../models/Customer");
const Item = require("../models/Item");
const Shop = require("../models/Shop");
const User = require("../models/User");

// exports.addUnpaidItemsToCustomer = async (req, res) => {
//   try {
//     const { customerId, unpaidItems } = req.body;

//     if (!customerId || !Array.isArray(unpaidItems) || unpaidItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer ID and newItems array are required",
//       });
//     }

//     // Find the customer
//     const customer = await Customer.findById(customerId);
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     // Create each new item and collect their IDs
//     const itemIds = [];

//     for (const item of unpaidItems) {
//       const unpaidItem = await Item.create({
//         itemName: item.itemName,
//         price: item.price,
//         dateTaken: item.dateTaken || Date.now(),
//         paid: item.paid || false,
//       });
//       itemIds.push(unpaidItem._id);
//     }

//     // Add new item IDs to customer
//     customer.unpaidItems.push(...itemIds);
//     await customer.save();

//     return res.status(200).json({
//       success: true,
//       message: "Items added to customer successfully",
//       customer,
//     });

//   } catch (error) {
//     console.error("Error adding unpaid items:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while adding unpaid items",
//     });
//   }
// };


// exports.createCustomer = async (req, res) => {
//   try {
    
//     const { name, contactInfo, unpaidItems, customerId } = req.body;

//     if (!name || !contactInfo || !unpaidItems) {
//       return res.status(500).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }
//     // check for shopkeeper
//     const userId = req.user.id;
//     const shopkeeperDetails = await User.findById(userId);
//     console.log("Shopkeeper Details: ", shopkeeperDetails);

//     if (!shopkeeperDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Shopkeeper Details not found",
//       });
//     }

//     // Create unpaid items and store their ObjectIds
//     const itemIds = [];

//     for (const item of unpaidItems) {
//       const newItem = await Item.create({
//         itemName: item.itemName,
//         price: item.price,
//         dateTaken: item.dateTaken || Date.now(),
//         paid: item.paid || false,
//       });
//       itemIds.push(newItem._id).populate("unpaidItems").exec();
//     }

//     // Create customer with reference to those items
//     const newCustomer = await Customer.create({
//       name,
//       contactInfo,
//       unpaidItems: itemIds,
//       createdBy: userId,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Customer created successfully",
//       data: newCustomer,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error while creating the customer",
//     });
//   }
// };


exports.createOrUpdateCustomer = async (req, res) => {
  try {
    const { name, contactInfo, unpaidItems, shopId } = req.body;
    const userId = req.user.id;

    if (!name || !contactInfo || !unpaidItems || unpaidItems.length === 0 || !shopId) {
      return res.status(400).json({
        success: false,
        message: "Name, contactInfo, unpaidItems, and shopId are required",
      });
    }

    // Verify user is a shopkeeper
    const shopkeeper = await User.findById(userId);
    if (!shopkeeper || shopkeeper.role !== "shopkeeper") {
      return res.status(403).json({
        success: false,
        message: "Only shopkeepers can perform this action",
      });
    }

    // Validate shop and ownership
    const shop = await Shop.findOne({ _id: shopId, owner: userId });
    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "Shop not found or you are not authorized to add customers to this shop",
      });
    }

    // Create unpaid items
    const itemIds = [];
    for (const item of unpaidItems) {
      const newItem = await Item.create({
        itemName: item.itemName,
        price: item.price,
        dateTaken: item.dateTaken || Date.now(),
        paid: false,
      });
      itemIds.push(newItem._id);
    }

    // Check if customer already exists (based on name/contact/shopkeeper/shop)
    let customer = await Customer.findOne({
      name,
      contactInfo,
      createdBy: userId,
      shopId: shopId,
    });

    if (customer) {
      // Add items to existing customer
      customer.unpaidItems.push(...itemIds);
      await customer.save();

      customer = await Customer.findById(customer._id).populate("unpaidItems");

      return res.status(200).json({
        success: true,
        message: "Unpaid items added to existing customer",
        customer,
      });
    } else {
      // Create new customer
      customer = await Customer.create({
        name,
        contactInfo,
        unpaidItems: itemIds,
        createdBy: userId,
        shopId: shopId,
      });

      // Push to shop's customer list
      shop.customers.push(customer._id);
      await shop.save();

      customer = await Customer.findById(customer._id).populate("unpaidItems");

      return res.status(201).json({
        success: true,
        message: "New customer created under selected shop",
        customer,
      });
    }

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing customer",
      error: error.message,
    });
  }
};



// Get all customers for a specific shop
exports.getCustomersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate({
      path: "customers",
      populate: {
        path: "unpaidItems",
        model: "Item"
      }
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully for the shop",
      data: shop.customers,
    });
  } catch (error) {
    console.error("Error fetching customers by shop:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers for the shop",
      error: error.message,
    });
  }
};


exports.getMyCustomers = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    const { shopId } = req.query;

    const filter = { createdBy: shopkeeperId };
    if (shopId) {
      filter.shopId = shopId;
    }

    const customers = await Customer.find(filter)
      .populate("unpaidItems")
      .populate("shopId", "shopName");

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch customers",
    });
  }
};


  exports.getCustomerWithItems = async (req, res) => {
    try {
      const { customerId } = req.params;
  
      const customer = await Customer.findById(customerId)
        .populate("unpaidItems")
        .populate("shopId", "shopName address") // optional
        .exec();
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching customer details",
        error: error.message,
      });
    }
  };
  

 
  exports.deleteCustomer = async (req, res) => {
    try {
      const {customerId} = req.params;
      const shopkeeperId = req.user.id;
  
      const customer = await Customer.findById(customerId);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
  
      if (customer.createdBy.toString() !== shopkeeperId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this customer",
        });
      }
  
      // Delete unpaid items
      await Item.deleteMany({ _id: { $in: customer.unpaidItems } });
  
      // Remove customer from shop
      if (customer.shopId) {
        await Shop.findByIdAndUpdate(customer.shopId, {
          $pull: { customers: customer._id },
        });
      }
  
      // Delete customer
      await customer.deleteOne();
  
      return res.status(200).json({
        success: true,
        message: "Customer and related unpaid items deleted successfully",
      });
  
    } catch (error) {
      console.error("Error deleting customer:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while deleting the customer",
        error: error.message,
      });
    }
  };
  


// exports.deleteCustomer = async (req, res) => {
//   try {
//     const customerId = req.params.id;
//     const shopkeeperId = req.user.id; // assuming auth middleware sets this

//     const customer = await Customer.findById(customerId);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     // Make sure the logged-in user is the one who created this customer
//     if (customer.createdBy.toString() !== shopkeeperId) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to delete this customer",
//       });
//     }

//     // First delete all unpaid items linked to this customer
//     await Item.deleteMany({ _id: { $in: customer.unpaidItems } });

//     // Then delete the customer
//     await customer.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Customer and related unpaid items deleted successfully",
//     });

//   } catch (error) {
//     console.error("Error deleting customer:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deleting the customer",
//       error: error.message,
//     });
//   }
// };

  