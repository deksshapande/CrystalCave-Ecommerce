const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const router = express.Router();

const User =
  require("../models/User");


// =========================================
// EMAIL TRANSPORTER
// =========================================

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_PASS

    }

  });


// =========================================
// SIGNUP
// =========================================

router.post("/signup", async (req, res) => {

  try {

    const {

      username,

      email,

      password

    } = req.body;


    // VALIDATION

    if(
      !username ||
      !email ||
      !password
    ){

      return res.status(400).json({

        success: false,

        message:
          "Please fill all fields"

      });

    }


    if(password.length < 6){

      return res.status(400).json({

        success: false,

        message:
          "Password must be at least 6 characters"

      });

    }


    // CHECK EXISTING USER

    const existingUser =
      await User.findOne({ email });

    if(existingUser){

      return res.status(400).json({

        success: false,

        message:
          "User already exists"

      });

    }


    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // CREATE USER

    const newUser =
      new User({

        username,

        email,

        password: hashedPassword

      });

    await newUser.save();


    // SEND WELCOME EMAIL

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject:
        "Welcome to CrystalCave 💎🌸",

      html: `

        <div style="
          font-family:Poppins,sans-serif;
          padding:20px;
        ">

          <h2>
            Welcome to CrystalCave 💎
          </h2>

          <p>
            Hi ${username},
          </p>

          <p>
            Your account was created successfully ✨
          </p>

          <p>
            Thank you for joining our magical crystal universe 🌸
          </p>

          <p>
            Stay positive and keep shining 💖
          </p>

        </div>

      `

    });


    // TOKEN

    const token =
      jwt.sign(

        {

          userId:
            newUser._id,

          role:
            newUser.role

        },

        process.env.JWT_SECRET,

        {

          expiresIn: "7d"

        }

      );


    res.status(201).json({

      success: true,

      token,

      username:
        newUser.username,

      role:
        newUser.role

    });

  }

  catch(err){

    console.error(err);

    res.status(500).json({

      success: false,

      message:
        "Signup failed"

    });

  }

});


// =========================================
// LOGIN
// =========================================

router.post("/login", async (req, res) => {

  try {

    const {

      email,

      password

    } = req.body;


    // VALIDATION

    if(
      !email ||
      !password
    ){

      return res.status(400).json({

        success: false,

        message:
          "Please fill all fields"

      });

    }


    // FIND USER

    const user =
      await User.findOne({ email });

    if(!user){

      return res.status(400).json({

        success: false,

        message:
          "Invalid credentials"

      });

    }


    // PASSWORD CHECK

    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );

    if(!isMatch){

      return res.status(400).json({

        success: false,

        message:
          "Invalid credentials"

      });

    }


    // TOKEN

    const token =
      jwt.sign(

        {

          userId:
            user._id,

          role:
            user.role

        },

        process.env.JWT_SECRET,

        {

          expiresIn: "7d"

        }

      );


    res.json({

      success: true,

      token,

      username:
        user.username,

      role:
        user.role

    });

  }

  catch(err){

    console.error(err);

    res.status(500).json({

      success: false,

      message:
        "Login failed"

    });

  }

});

module.exports = router;