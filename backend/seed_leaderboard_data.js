const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Sample data for leaderboard testing
const sampleUsers = [
    {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "1234567890",
        password: "hashedpassword123",
        bloodGroup: "O+",
        location: {
            city: "New York",
            state: "NY"
        },
        organDonation: true,
        donationCount: 25,
        totalDonations: 25,
        level: 5,
        experience: 250,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-01-15")
            },
            {
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆",
                earnedDate: new Date("2023-03-20")
            },
            {
                name: "Hero Donor",
                description: "Completed 10 blood donations",
                icon: "🦸",
                earnedDate: new Date("2023-06-10")
            },
            {
                name: "Legendary Donor",
                description: "Completed 25 blood donations",
                icon: "👑",
                earnedDate: new Date("2023-12-01")
            }
        ],
        lastDonationDate: new Date("2024-01-15")
    },
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "2345678901",
        password: "hashedpassword123",
        bloodGroup: "A+",
        location: {
            city: "Los Angeles",
            state: "CA"
        },
        organDonation: false,
        donationCount: 18,
        totalDonations: 18,
        level: 4,
        experience: 180,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-02-10")
            },
            {
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆",
                earnedDate: new Date("2023-04-15")
            },
            {
                name: "Hero Donor",
                description: "Completed 10 blood donations",
                icon: "🦸",
                earnedDate: new Date("2023-08-20")
            }
        ],
        lastDonationDate: new Date("2024-01-10")
    },
    {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "3456789012",
        password: "hashedpassword123",
        bloodGroup: "B+",
        location: {
            city: "Chicago",
            state: "IL"
        },
        organDonation: true,
        donationCount: 12,
        totalDonations: 12,
        level: 3,
        experience: 120,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-03-05")
            },
            {
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆",
                earnedDate: new Date("2023-05-12")
            },
            {
                name: "Hero Donor",
                description: "Completed 10 blood donations",
                icon: "🦸",
                earnedDate: new Date("2023-10-25")
            }
        ],
        lastDonationDate: new Date("2024-01-05")
    },
    {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "4567890123",
        password: "hashedpassword123",
        bloodGroup: "AB+",
        location: {
            city: "Houston",
            state: "TX"
        },
        organDonation: false,
        donationCount: 8,
        totalDonations: 8,
        level: 2,
        experience: 80,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-04-20")
            },
            {
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆",
                earnedDate: new Date("2023-07-15")
            }
        ],
        lastDonationDate: new Date("2023-12-20")
    },
    {
        name: "David Wilson",
        email: "david.wilson@example.com",
        phone: "5678901234",
        password: "hashedpassword123",
        bloodGroup: "O-",
        location: {
            city: "Phoenix",
            state: "AZ"
        },
        organDonation: true,
        donationCount: 5,
        totalDonations: 5,
        level: 1,
        experience: 50,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-05-10")
            },
            {
                name: "Regular Donor",
                description: "Completed 5 blood donations",
                icon: "🏆",
                earnedDate: new Date("2023-09-30")
            }
        ],
        lastDonationDate: new Date("2023-09-30")
    },
    {
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        phone: "6789012345",
        password: "hashedpassword123",
        bloodGroup: "A-",
        location: {
            city: "Philadelphia",
            state: "PA"
        },
        organDonation: false,
        donationCount: 3,
        totalDonations: 3,
        level: 1,
        experience: 30,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-06-15")
            }
        ],
        lastDonationDate: new Date("2023-11-15")
    },
    {
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        phone: "7890123456",
        password: "hashedpassword123",
        bloodGroup: "B-",
        location: {
            city: "San Antonio",
            state: "TX"
        },
        organDonation: true,
        donationCount: 1,
        totalDonations: 1,
        level: 1,
        experience: 10,
        badges: [
            {
                name: "First Blood",
                description: "Completed your first blood donation",
                icon: "🩸",
                earnedDate: new Date("2023-07-20")
            }
        ],
        lastDonationDate: new Date("2023-07-20")
    }
];

async function seedLeaderboardData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing users (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // console.log('Cleared existing users');

        // Check if sample users already exist
        const existingUsers = await User.find({
            email: { $in: sampleUsers.map(user => user.email) }
        });

        if (existingUsers.length > 0) {
            console.log('Sample users already exist. Updating donation counts...');
            
            // Update existing users with new donation counts
            for (const user of existingUsers) {
                const sampleUser = sampleUsers.find(su => su.email === user.email);
                if (sampleUser) {
                    user.donationCount = sampleUser.donationCount;
                    user.totalDonations = sampleUser.totalDonations;
                    user.level = sampleUser.level;
                    user.experience = sampleUser.experience;
                    user.badges = sampleUser.badges;
                    user.lastDonationDate = sampleUser.lastDonationDate;
                    await user.save();
                }
            }
        } else {
            // Insert new sample users
            const insertedUsers = await User.insertMany(sampleUsers);
            console.log(`Inserted ${insertedUsers.length} sample users`);
        }

        console.log('Leaderboard data seeded successfully!');
        
        // Display the leaderboard
        const leaderboard = await User.find()
            .select('name bloodGroup donationCount level badges location.city location.state')
            .sort({ donationCount: -1, totalDonations: -1 })
            .limit(10);

        console.log('\nCurrent Leaderboard:');
        console.log('===================');
        leaderboard.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.bloodGroup}) - ${user.donationCount} donations - Level ${user.level}`);
        });

    } catch (error) {
        console.error('Error seeding leaderboard data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeding function
seedLeaderboardData();
