const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

// Use your actual Razorpay test key & secret
const razorpay = new Razorpay({
  key_id: "rzp_test_1DP5mmOlF5G5ag",
  key_secret: "YOUR_SECRET_KEY_HERE"
});

// Create order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; // amount in INR
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // convert INR to paise
      currency: "INR",
      payment_capture: 1
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

module.exports = router;
