
const express = require("express");
const router = express.Router();

const {
    createShipment,
    getMyShipments,
    getShipmentById,
    updateShipment,
    cancelShipment,
    updateShipmentStatus
} = require("../controllers/shipmentController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createShipment);
router.get("/", getMyShipments);
router.get("/:id", getShipmentById);
router.put("/:id", updateShipment);
router.delete("/:id", cancelShipment);

// Shipment lifecycle
router.patch("/:id/status", updateShipmentStatus);

module.exports = router;
