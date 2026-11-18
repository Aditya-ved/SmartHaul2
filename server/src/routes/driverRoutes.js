
const express = require("express");
const router = express.Router();

const {
    createDriver,
    getMyDrivers,
    deleteDriver,
    getMyWork,
    resetDriverPassword
} = require("../controllers/driverController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Driver dashboard
router.get("/my-work", getMyWork);

// Owner driver management
router.post("/", createDriver);
router.get("/", getMyDrivers);
router.delete("/:id", deleteDriver);

// Reset a driver's password
router.put("/:id/reset-password", resetDriverPassword);

module.exports = router;
