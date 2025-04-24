require("dotenv").config();
const express= require("express");
const app= express();
const port= process.env.PORT || 5000;
const dbConnect = require("./config/database");
const cors= require("cors");

// Import routes
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const shopRoutes = require("./routes/shopRoutes");
const itemRoutes = require("./routes/itemRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const salesRoutes = require("./routes/salesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes= require("./routes/paymentsRoutes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET,POST,PUT,DELETE"],
      credentials: true,
    })
  );

// Connect to Database
dbConnect();

app.use("/api/users", userRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/shopkeeper", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);


// Default route
app.get('/', (req, res) => {
    res.send('Hello World!'); 
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
