
const express = require("express");
const router = express.Router();

const { bookTruck } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    estimate
} = require("../controllers/bookingLifecycleController");
const { createMockPayment } = require("../controllers/platformController");

router.use(protect);

router.post("/lifecycle", createBooking);
router.post("/estimate", estimate);
router.post("/payment/mock", createMockPayment);
router.get("/", getBookings);
router.patch("/:id/status", updateBookingStatus);
router.post("/:shipmentId/:vehicleId", bookTruck);

module.exports = router;
