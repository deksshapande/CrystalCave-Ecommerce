// backend/routes/productRoutes.js
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// ✅ GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

// ✅ POST new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, inStock } = req.body;

    // basic validation
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    const newProduct = new Product({ name, description, price, image, inStock });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product: savedProduct
    });
  } catch (err) {
    res.status(400).json({ message: "Error creating product", error: err.message });
  }
});

// ✅ PUT update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "✅ Product updated", product: updatedProduct });
  } catch (err) {
    res.status(400).json({ message: "Error updating product", error: err.message });
  }
});

// ✅ DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

module.exports = router;
