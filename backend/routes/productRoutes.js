const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message
    });
  }
});


// ✅ GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching product",
      error: err.message
    });
  }
});


// ✅ CREATE product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, inStock } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      inStock
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (err) {
    res.status(400).json({
      message: "Error creating product",
      error: err.message
    });
  }
});


// ✅ UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProduct);

  } catch (err) {
    res.status(400).json({
      message: "Error updating product",
      error: err.message
    });
  }
});


// ✅ DELETE ONE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting product",
      error: err.message
    });
  }
});

module.exports = router;

