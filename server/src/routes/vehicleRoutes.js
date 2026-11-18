
const express = require("express");
const router = express.Router();

const {
    addVehicle,
    getMyVehicles,
    getPublicVehicles,
    getPublicVehicleById,
    updateVehicle,
    deleteVehicle,
    assignDriver,
    removeDriver
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");

router.get("/public", getPublicVehicles);
router.get("/public/:id", getPublicVehicleById);

router.use(protect);

router.post("/", addVehicle);

router.get("/", getMyVehicles);

router.put("/:id", updateVehicle);

router.delete("/:id", deleteVehicle);

router.patch("/:id/assign-driver", assignDriver);

router.patch("/:id/remove-driver", removeDriver);

module.exports = router;
