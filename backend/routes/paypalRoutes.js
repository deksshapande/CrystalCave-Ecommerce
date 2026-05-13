const express = require("express");

const axios = require("axios");

const router = express.Router();


// =========================================
// GET ACCESS TOKEN
// =========================================

async function getAccessToken() {

  const auth = Buffer.from(

    process.env.PAYPAL_CLIENT_ID +
    ":" +
    process.env.PAYPAL_SECRET

  ).toString("base64");


  const response = await axios.post(

    "https://api-m.sandbox.paypal.com/v1/oauth2/token",

    "grant_type=client_credentials",

    {

      headers: {

        Authorization: `Basic ${auth}`,

        "Content-Type":
          "application/x-www-form-urlencoded"

      }

    }

  );

  return response.data.access_token;

}


// =========================================
// CREATE ORDER
// =========================================

router.post("/create-order", async (req, res) => {

  try {

    const { amount } = req.body;

    const accessToken =
      await getAccessToken();

    const response = await axios.post(

      "https://api-m.sandbox.paypal.com/v2/checkout/orders",

      {

        intent: "CAPTURE",

        purchase_units: [

          {

            amount: {

              currency_code: "USD",

              value: amount

            }

          }

        ]

      },

      {

        headers: {

          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json"

        }

      }

    );

    res.json(response.data);

  }

  catch(err){

    console.error(

      err.response?.data || err.message

    );

    res.status(500).json({

      error: "PayPal order failed"

    });

  }

});


// =========================================
// CAPTURE ORDER
// =========================================

router.post("/capture-order", async (req, res) => {

  try {

    const { orderID } = req.body;

    const accessToken =
      await getAccessToken();

    const response = await axios.post(

      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,

      {},

      {

        headers: {

          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json"

        }

      }

    );

    res.json(response.data);

  }

  catch(err){

    console.error(

      err.response?.data || err.message

    );

    res.status(500).json({

      error: "Capture failed"

    });

  }

});

module.exports = router;