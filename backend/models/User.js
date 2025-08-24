const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Add name field
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    organDonation: { type: Boolean, default: false },
    // Gamification fields
    donationCount: { type: Number, default: 0 },
    totalDonations: { type: Number, default: 0 },
    lastDonationDate: { type: Date },
    badges: [{
        name: { type: String },
        description: { type: String },
        earnedDate: { type: Date, default: Date.now },
        icon: { type: String }
    }],
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

