const Transaction = require("../models/Transaction");
const Shop = require("../models/Shop");
const User = require("../models/User");

exports.createTransaction = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { shopId, totalAmount } = req.body;

    if (!shopId || !customerId || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "shopId, customerId, and totalAmount are required",
      });
    }

    const transaction = await Transaction.create({
      shopId,
      customerId,
      totalAmount,
    });

    // Populate the fields
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("shopId")
      .populate("customerId");

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating transaction",
      error: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    const customerId = req.user.id;

    if (customerId) {
      const transactions = await Transaction.find({ customerId })
        .populate("shopId", "shopName owner")
        .populate("customerId", "name email");

      console.log("Transactions found:", transactions.length);
      return res.status(200).json({
        success: true,
        transactions,
      });
    } else if (shopkeeperId) {
      const shops = await Shop.find({ owner: shopkeeperId }).select("_id");

      const shopIds = shops.map((shop) => shop._id);

      // Fetch transactions only for those shops
      const transactions = await Transaction.find({ shopId: { $in: shopIds } })
        .populate("shopId", "shopName owner")
        .populate("customerId", "name email");

      return res.status(200).json({
        success: true,
        transactions,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

// exports.getAllTransactions = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("user", user)
//     const role = req.user.role;
//     console.log("role", role)

//     if (role === "shopkeeper") {
//       // Step 1: Get all shops owned by this shopkeeper
//       const shops = await Shop.find({ owner: userId }).select("_id");
//       const shopIds = shops.map(shop => shop._id);

//       // Step 2: Get customers created by this shopkeeper
//       const customers = await User.find({ createdBy: userId, role: "customer" }).select("_id");
//       const customerIds = customers.map(c => c._id);

//       if (shopIds.length === 0 || customerIds.length === 0) {
//         return res.status(200).json({
//           success: true,
//           transactions: [],
//           message: "No shops or customers found for this shopkeeper",
//         });
//       }

//       // Step 3: Fetch transactions
//       const transactions = await Transaction.find({
//         shopId: { $in: shopIds },
//         customer: { $in: customerIds }
//       })
//         .populate("shopId", "shopName owner")
//         .populate("customerId", "name email");

//       return res.status(200).json({
//         success: true,
//         transactions,
//       });

//     } else if (role === "customer") {
//       // Customer sees their own transactions
//       const transactions = await Transaction.find({ customer: userId })
//         .populate("shopId", "shopName owner")
//         .populate("customerId", "name email");

//       return res.status(200).json({
//         success: true,
//         transactions,
//       });
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized role",
//       });
//     }

//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching transactions",
//       error: error.message,
//     });
//   }
// };


exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "customer") {
      // Customer can see only their transactions
      const transactions = await Transaction.find({ customerId: userId })
        .populate("shopId", "shopName owner")
        .populate("customerId", "name email");

      console.log("Customer transactions found:", transactions.length);
      return res.status(200).json({
        success: true,
        transactions,
      });

    } else if (role === "shopkeeper") {
      // Shopkeeper can see transactions for their shops
      const shops = await Shop.find({ owner: userId }).select("_id");
      const shopIds = shops.map(shop => shop._id);

      if (shopIds.length === 0) {
        return res.status(200).json({
          success: true,
          transactions: [],
          message: "No shops found for this shopkeeper",
        });
      }

      const transactions = await Transaction.find({ shopId: { $in: shopIds } })
        .populate("shopId", "shopName owner")
        .populate("customerId", "name email");

      console.log("Shopkeeper transactions found:", transactions.length);
      return res.status(200).json({
        success: true,
        transactions,
      });

    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};



// exports.getAllTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find()
//       .populate("shopId", "name") // populate shop name
//       .populate("customerId", "name email"); // now refers to User

//     return res.status(200).json({
//       success: true,
//       transactions,
//     });
//   } catch (error) {
//     console.error("Error fetching transactions:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching transactions",
//       error: error.message,
//     });
//   }
// };
