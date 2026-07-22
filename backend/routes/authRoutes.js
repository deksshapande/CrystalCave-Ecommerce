const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

const User = require("../models/User");

// =========================================
// EMAIL TRANSPORTER
// =========================================

const transporter = nodemailer.createTransport({

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

    if (
      !username ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,
        message: "Please fill all fields"

      });

    }

    if (password.length < 6) {

      return res.status(400).json({

        success: false,
        message: "Password must be at least 6 characters"

      });

    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: "User already exists"

      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser =
      new User({

        username,
        email,
        password: hashedPassword

      });

    await newUser.save();

    // WELCOME EMAIL

    try {

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

    }

    catch (emailErr) {

      console.log(
        "Email failed but signup continued:",
        emailErr.message
      );

    }

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

  catch (err) {

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

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,
        message: "Please fill all fields"

      });

    }

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        success: false,
        message:
          "Invalid credentials"

      });

    }

    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );

    if (!isMatch) {

      return res.status(400).json({

        success: false,
        message:
          "Invalid credentials"

      });

    }

    // DEBUG

    console.log("========== LOGIN ==========");
    console.log("EMAIL:", user.email);
    console.log("USERNAME:", user.username);
    console.log("ROLE FROM DATABASE:", user.role);
    console.log("===========================");

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

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,
      message:
        "Login failed"

    });

  }

});

module.exports = router;