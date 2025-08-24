const express = require("express");
const { getLeaderboard, getUserStats } = require("../controllers/leaderboardController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Get leaderboard (public route)
router.get("/", getLeaderboard);

// Get user's stats and ranking (requires authentication)
router.get("/user-stats", authMiddleware, getUserStats);

module.exports = router;
