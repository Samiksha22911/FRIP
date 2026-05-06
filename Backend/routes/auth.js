const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

const client = new OAuth2Client("YOUR_CLIENT_ID");

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_CLIENT_ID",
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let role = "";

    if (email.endsWith("@mitsgwl.ac.in")) role = "student";
    else if (email.endsWith("@mitsgwalior.in")) role = "faculty";
    else return res.status(403).json({ message: "Unauthorized" });

    const user = {
      email,
      name: payload.name,
      role,
    };

    const appToken = jwt.sign(user, "secret_key", {
      expiresIn: "7d",
    });

    res.json({
      token: appToken,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;