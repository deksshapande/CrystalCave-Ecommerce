console.log("APP FILE RUNNING:", __filename);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const paypalRoutes = require("./routes/paypalRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
  
  

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Correct frontend path
const frontendPath = path.join(__dirname, "..", "frontend");
console.log(frontendPath);

// ✅ Serve frontend files
app.use(express.static(frontendPath));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/paypal", paypalRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



