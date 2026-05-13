const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  customerName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  products: [

    {

      name: String,

      price: Number,

      quantity: Number,

      image: String

    }

  ],

  totalAmount: {

    type: Number,

    required: true

  },

  paymentMethod: {

    type: String,

    default: "COD"

  },

  paymentStatus: {

    type: String,

    default: "Pending"

  },

  orderStatus: {

    type: String,

    default: "Processing"

  },

  createdAt: {

    type: Date,

    default: Date.now

  }

});

module.exports =
  mongoose.model("Order", orderSchema);