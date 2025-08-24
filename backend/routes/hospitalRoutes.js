const express = require("express");
const {
    getHospitalProfile,
    updateInventory,
    getAllHospitals,
    getHospitalById,
    addReview,
    requestBlood,
    findNearestHospital,
    updateLocation, // Add this
} = require("../controllers/hospitalController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/profile", authMiddleware, getHospitalProfile);
router.put("/inventory", authMiddleware, updateInventory);
router.put("/location", authMiddleware, updateLocation); // Add this route
router.get("/", getAllHospitals);
router.get("/:id", getHospitalById);
router.post("/:id/reviews", authMiddleware, addReview);
router.post("/:hospitalId/request-blood", requestBlood);
router.get("/nearest", findNearestHospital);

module.exports = router;
