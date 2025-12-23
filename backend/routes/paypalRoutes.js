// backend/routes/paypalRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Create order on PayPal
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    // Create order request to PayPal API
    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error creating PayPal order:", err.message);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Capture payment
router.post("/capture-order", async (req, res) => {
  const { orderID } = req.body;

  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error capturing PayPal payment:", err.message);
    res.status(500).json({ error: "Payment capture failed" });
  }
});

module.exports = router;

// Capture payment
router.post("/capture-order", async (req, res) => {
  const { orderID } = req.body;

  if (!orderID) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error capturing PayPal payment:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment capture failed" });
  }
});
