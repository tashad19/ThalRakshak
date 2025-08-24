const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const hospitalRoutes = require("./routes/hospitalRoutes.js");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const donorRoutes = require("./routes/donorRoutes");
const { verifyEmailService } = require('./utils/emailService');
const predictRoute = require('./routes/predict');
const contactRoutes = require("./routes/contactRoutes");
const flaskChatRoutes = require("./routes/flaskChatRoutes");
const imageRoutes = require("./routes/imageRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({ origin: "*", credentials: true }));

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5173/contact",
  "http://localhost:4173", // add this
  "https://thal-rakshak.vercel.app" // or your production domain if any
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
verifyEmailService();

// Configure fileUpload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Image processing route
app.use("/api/process-image", imageRoutes);

// Routes
app.get("/", (req, res) => {
    const endpoints = {
        "API Endpoints": {
            "Authentication": "/api/auth",
            "Users": "/api/users",
            "Hospitals": "/api/hospitals",
            "Emergency": "/api/emergency",
            "Chatbot": "/api/chatbot",
            "Donation": "/api/donate",
            "Donors": "/api/donors",
            "Prediction": "/api/predict",
            "Contact": "/api/contact"
        }
    };
    res.status(200).json(endpoints);
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/donate", donorRoutes);
app.use("/api/donors", donorRoutes); 
app.use('/api/predict', predictRoute);
app.use("/api/contact", contactRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api/intent", flaskChatRoutes);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process with failure
    });

const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is in use, trying another port...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
};

startServer(PORT);
