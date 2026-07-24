const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

const CLIENT_ID =
  "361045948459-hjfpqeacun8e16osvbkoljh16jk3io68.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

// Google Login Route
router.post("/google-login", async (req, res) => {
  try {
    const { token, selectedRole } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Demo mode: allow any gmail + selected role
    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: selectedRole,
    };

    // Generate JWT token
    const appToken = jwt.sign(user, "secret_key", {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token: appToken,
      user,
    });
  } catch (error) {
    console.log("Google Login Error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;