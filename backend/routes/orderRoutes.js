const express = require("express");

const router = express.Router();

const nodemailer = require("nodemailer");

const Order = require("../models/Order");


// EMAIL TRANSPORTER

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS

    }

  });


// TEST ROUTE

router.get("/test", (req, res) => {

  res.json({

    message:
      "Orders route working ✅"

  });

});


// CREATE ORDER

router.post("/", async (req, res) => {

  try {

    const orderId =
      "CC-" + Date.now();

    const newOrder =
      new Order({

        ...req.body,

        orderId

      });


    // SAVE ORDER

    await newOrder.save();

    console.log(
      "✅ Order saved successfully"
    );


    // EMAIL PRODUCTS

    const productsHTML =
      newOrder.products
      .map(product => `

        <li>
          ${product.name}
          ×
          ${product.quantity}
          — ₹${product.price}
        </li>

      `)
      .join("");


    // EMAIL OPTIONS

    const mailOptions = {

      from:
        process.env.EMAIL_USER,

      to:
        newOrder.email,

      subject:
        `CrystalCave Order Confirmation ✨ (${orderId})`,

      html: `

        <div style="
          font-family:Poppins,sans-serif;
          padding:20px;
        ">

          <h2>
            Thank you for your order 💎
          </h2>

          <p>
            Hi ${newOrder.customerName},
          </p>

          <p>
            Your CrystalCave order has been placed successfully ✨
          </p>

          <h3>
            Order ID:
            ${orderId}
          </h3>

          <ul>
            ${productsHTML}
          </ul>

          <h3>
            Total:
            ₹${newOrder.totalAmount}
          </h3>

          <p>
            Payment Method:
            ${newOrder.paymentMethod}
          </p>

          <p>
            We’ll prepare your crystals with love 🌸
          </p>

        </div>

      `

    };


    // SEND EMAIL (OPTIONAL)

    try {

      await transporter.sendMail(
        mailOptions
      );

      console.log(
        "✅ Confirmation email sent"
      );

    }

    catch (emailErr) {

      console.error(
        "❌ Email failed:",
        emailErr.message
      );

    }


    // SUCCESS RESPONSE

    res.status(201).json({

      success: true,

      message:
        "Order placed successfully 🌸",

      order: newOrder

    });

  }

  catch (err) {

    console.error(
      "❌ Order Route Error:",
      err
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to place order"

    });

  }

});


// GET ALL ORDERS

router.get("/", async (req, res) => {

  try {

    const orders =
      await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      message:
        "Failed to fetch orders"

    });

  }

});


// UPDATE ORDER STATUS

router.put("/:id", async (req, res) => {

  try {

    const updatedOrder =
      await Order.findByIdAndUpdate(

        req.params.id,

        {

          orderStatus:
            req.body.orderStatus

        },

        {

          new: true

        }

      );

    res.json({

      success: true,

      message:
        "Order status updated 🌸",

      updatedOrder

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message:
        "Failed to update order"

    });

  }

});


module.exports = router;