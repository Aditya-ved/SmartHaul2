
const express = require("express");
const router = express.Router();

const {
    getPendingVehicles,
    getVehiclesByVerificationStatus,
    updateVehicleVerification
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/vehicles/pending", getPendingVehicles);

router.get(
    "/vehicles/:status",
    getVehiclesByVerificationStatus
);

router.patch(
    "/vehicles/:id/verification",
    updateVehicleVerification
);

module.exports = router;
