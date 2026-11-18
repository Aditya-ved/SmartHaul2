const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createDocument, getDocuments, reviewDocument, createReview, createSupportTicket,
    getSupportTickets, createDispute, getMaintenance, createMaintenance, updateTracking, getTracking
} = require("../controllers/trustOperationsController");

router.use(protect);
router.post("/documents", createDocument);
router.get("/documents", getDocuments);
router.patch("/documents/:id/review", reviewDocument);
router.post("/reviews", createReview);
router.post("/support", createSupportTicket);
router.get("/support", getSupportTickets);
router.post("/disputes", createDispute);
router.get("/maintenance", getMaintenance);
router.post("/maintenance", createMaintenance);
router.patch("/tracking/:shipmentId", updateTracking);
router.get("/tracking/:shipmentId", getTracking);

module.exports = router;
