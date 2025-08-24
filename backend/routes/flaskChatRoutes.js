const express = require("express");
const axios = require("axios");

const router = express.Router();

// Proxy to Flask API
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post("http://127.0.0.1:5001/chat", { message });
    res.json(response.data);
  } catch (error) {
    console.error("Flask API error:", error.message);
    res.status(500).json({ error: "Error communicating with ML service" });
  }
});

module.exports = router;
