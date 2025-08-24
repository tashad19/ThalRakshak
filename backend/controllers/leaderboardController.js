const User = require("../models/User.js");

// Get leaderboard based on donation count
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select('name bloodGroup donationCount level badges location.city location.state')
            .sort({ donationCount: -1, totalDonations: -1 })
            .limit(50); // Top 50 users

        // Add rank to each user
        const leaderboardWithRank = leaderboard.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            bloodGroup: user.bloodGroup,
            donationCount: user.donationCount,
            totalDonations: user.totalDonations,
            level: user.level,
            badges: user.badges,
            location: user.location
        }));

        res.json({
            success: true,
            leaderboard: leaderboardWithRank
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard"
        });
    }
};

// Get user's ranking and stats
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's current stats
        const user = await User.findById(userId)
            .select('name bloodGroup donationCount totalDonations level experience badges lastDonationDate');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get user's rank
        const userRank = await User.countDocuments({
            donationCount: { $gt: user.donationCount }
        }) + 1;

        // Calculate next level experience
        const nextLevelExp = user.level * 100;
        const progressToNextLevel = (user.experience / nextLevelExp) * 100;

        // Get recent top donors for comparison
        const topDonors = await User.find()
            .select('name donationCount level')
            .sort({ donationCount: -1 })
            .limit(5);

        res.json({
            success: true,
            userStats: {
                name: user.name,
                bloodGroup: user.bloodGroup,
                donationCount: user.donationCount,
                totalDonations: user.totalDonations,
                level: user.level,
                experience: user.experience,
                nextLevelExp,
                progressToNextLevel,
                rank: userRank,
                badges: user.badges,
                lastDonationDate: user.lastDonationDate
            },
            topDonors
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user stats"
        });
    }
};

// Update user's donation count (called when donation is completed)
const updateDonationCount = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Update donation stats
        user.donationCount += 1;
        user.totalDonations += 1;
        user.lastDonationDate = new Date();
        
        // Add experience points (10 points per donation)
        user.experience += 10;
        
        // Check for level up
        const requiredExp = user.level * 100;
        if (user.experience >= requiredExp) {
            user.level += 1;
            user.experience -= requiredExp;
        }

        // Check for badges
        const newBadges = [];
        
        // First donation badge
        if (user.donationCount === 1 && !user.badges.find(b => b.name === "First Blood")) {
            newBadges.push({
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸"
            });
        }
        
        // 5 donations badge
        if (user.donationCount === 5 && !user.badges.find(b => b.name === "Regular Donor")) {
            newBadges.push({
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆"
            });
        }
        
        // 10 donations badge
        if (user.donationCount === 10 && !user.badges.find(b => b.name === "Hero Donor")) {
            newBadges.push({
                name: "Hero Donor",
                description: "Completed 10 blood donations",
                icon: "🦸"
            });
        }
        
        // 25 donations badge
        if (user.donationCount === 25 && !user.badges.find(b => b.name === "Legendary Donor")) {
            newBadges.push({
                name: "Legendary Donor",
                description: "Completed 25 blood donations",
                icon: "👑"
            });
        }
        
        // 50 donations badge
        if (user.donationCount === 50 && !user.badges.find(b => b.name === "Master Donor")) {
            newBadges.push({
                name: "Master Donor",
                description: "Completed 50 blood donations",
                icon: "⭐"
            });
        }

        // Add new badges to user
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();
        
        return {
            success: true,
            newLevel: user.level,
            newBadges,
            experience: user.experience
        };
    } catch (error) {
        console.error("Error updating donation count:", error);
        throw error;
    }
};

module.exports = {
    getLeaderboard,
    getUserStats,
    updateDonationCount
};
