const express = require("express");

const jwt = require("jsonwebtoken");

const router = express.Router();

const Product =
  require("../models/Product");

const Order =
  require("../models/Order");


// =========================================
// ADMIN MIDDLEWARE
// =========================================

function verifyAdmin(req, res, next){

  const token =
    req.headers.authorization;

  if(!token){

    return res.status(401).json({

      success: false,

      message:
        "No token provided"

    });

  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    if(decoded.role !== "admin"){

      return res.status(403).json({

        success: false,

        message:
          "Admin access denied"

      });

    }

    next();

  }

  catch(err){

    return res.status(401).json({

      success: false,

      message:
        "Invalid token"

    });

  }

}


// =========================================
// GET ALL ORDERS
// =========================================

router.get(
  "/orders",
  verifyAdmin,
  async (req, res) => {

    try {

      const orders =
        await Order.find()
        .sort({ createdAt: -1 });

      res.json(orders);

    }

    catch(err){

      console.error(err);

      res.status(500).json({

        message:
          "Failed to fetch orders"

      });

    }

  }
);


// =========================================
// UPDATE ORDER STATUS
// =========================================

router.put(
  "/orders/:id",
  verifyAdmin,
  async (req, res) => {

    try {

      const updatedOrder =
        await Order.findByIdAndUpdate(

          req.params.id,

          {

            orderStatus:
              req.body.orderStatus

          },

          { new: true }

        );

      res.json({

        success: true,

        updatedOrder

      });

    }

    catch(err){

      console.error(err);

      res.status(500).json({

        message:
          "Failed to update order"

      });

    }

  }
);


// =========================================
// ADD PRODUCT
// =========================================

router.post(
  "/products",
  verifyAdmin,
  async (req, res) => {

    try {

      const product =
        new Product(req.body);

      await product.save();

      res.status(201).json({

        success: true,

        product

      });

    }

    catch(err){

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Failed to add product"

      });

    }

  }
);

module.exports = router;