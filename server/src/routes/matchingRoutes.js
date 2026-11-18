
const express = require("express");
const router = express.Router();

const { findMatchingVehicles } = require("../controllers/matchingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:shipmentId", protect, findMatchingVehicles);

module.exports = router;
