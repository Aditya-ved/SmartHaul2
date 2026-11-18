const mongoose = require("mongoose");
const VerificationDocument = require("../models/VerificationDocument");
const Review = require("../models/Review");
const SupportTicket = require("../models/SupportTicket");
const Dispute = require("../models/Dispute");
const Maintenance = require("../models/Maintenance");
const Booking = require("../models/Booking");
const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");

const createDocument = async (req, res) => {
    const { type, fileName, fileUrl, vehicleId } = req.body;
    if (!type || !fileName || !fileUrl) return res.status(400).json({ success: false, message: "Document type, name and URL are required" });
    const document = await VerificationDocument.create({ userId: req.user.id, vehicleId: vehicleId || null, type, fileName, fileUrl });
    res.status(201).json({ success: true, document });
};

const getDocuments = async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    const documents = await VerificationDocument.find(filter).populate("vehicleId", "vehicleNumber").populate("reviewerId", "fullName").sort({ createdAt: -1 });
    res.status(200).json({ success: true, documents });
};

const reviewDocument = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid document" });
    if (!["verified", "rejected"].includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid review status" });
    const document = await VerificationDocument.findByIdAndUpdate(req.params.id, { status: req.body.status, reviewerId: req.user.id, reviewerNote: req.body.reviewerNote || "" }, { new: true });
    if (!document) return res.status(404).json({ success: false, message: "Document not found" });
    res.status(200).json({ success: true, document });
};

const createReview = async (req, res) => {
    const { bookingId, revieweeId, rating, comment } = req.body;
    if (!mongoose.isValidObjectId(bookingId) || !mongoose.isValidObjectId(revieweeId)) return res.status(400).json({ success: false, message: "Invalid booking or reviewee" });
    if (Number(rating) < 1 || Number(rating) > 5) return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    const existing = await Review.findOne({ bookingId });
    if (existing) return res.status(409).json({ success: false, message: "Review already submitted" });
    const review = await Review.create({ bookingId, reviewerId: req.user.id, revieweeId, rating, comment });
    res.status(201).json({ success: true, review });
};

const createSupportTicket = async (req, res) => {
    const { category, subject, description } = req.body;
    if (!subject?.trim() || !description?.trim()) return res.status(400).json({ success: false, message: "Subject and description are required" });
    const ticket = await SupportTicket.create({ senderId: req.user.id, category, subject: subject.trim(), description: description.trim() });
    res.status(201).json({ success: true, ticket });
};

const getSupportTickets = async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { senderId: req.user.id };
    const tickets = await SupportTicket.find(filter).populate("senderId", "fullName email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
};

const createDispute = async (req, res) => {
    const { bookingId, category, description } = req.body;
    if (!mongoose.isValidObjectId(bookingId) || !description?.trim()) return res.status(400).json({ success: false, message: "Valid booking and description are required" });
    const dispute = await Dispute.create({ bookingId, openedBy: req.user.id, category, description });
    res.status(201).json({ success: true, dispute });
};

const getMaintenance = async (req, res) => {
    const filter = ["individual_owner", "company_admin"].includes(req.user.role) ? { ownerId: req.user.id } : {};
    const maintenance = await Maintenance.find(filter).populate("vehicleId", "vehicleNumber").sort({ scheduledFor: 1 });
    res.status(200).json({ success: true, maintenance });
};

const createMaintenance = async (req, res) => {
    const { vehicleId, type, title, scheduledFor, notes } = req.body;
    if (!mongoose.isValidObjectId(vehicleId) || !title?.trim() || !scheduledFor) return res.status(400).json({ success: false, message: "Vehicle, title and schedule are required" });
    const maintenance = await Maintenance.create({ vehicleId, ownerId: req.user.id, type, title: title.trim(), scheduledFor, notes });
    res.status(201).json({ success: true, maintenance });
};

const updateTracking = async (req, res) => {
    const { shipmentId } = req.params;
    if (!mongoose.isValidObjectId(shipmentId)) return res.status(400).json({ success: false, message: "Invalid shipment" });
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    if (shipment.senderId.toString() !== req.user.id) {
        if (!shipment.bookedVehicleId) return res.status(403).json({ success: false, message: "Not authorized" });
        const vehicle = await Vehicle.findById(shipment.bookedVehicleId).select("ownerId assignedDriver");
        const authorized = vehicle && (
            vehicle.ownerId.toString() === req.user.id ||
            (vehicle.assignedDriver && vehicle.assignedDriver.toString() === req.user.id)
        );
        if (!authorized) return res.status(403).json({ success: false, message: "Not authorized" });
    }
    shipment.tracking.currentLocation = {
        address: req.body.address || "",
        latitude: req.body.latitude ?? null,
        longitude: req.body.longitude ?? null,
        updatedAt: new Date()
    };
    if (req.body.estimatedArrival) shipment.tracking.estimatedArrival = new Date(req.body.estimatedArrival);
    await shipment.save();
    res.status(200).json({ success: true, tracking: shipment.tracking });
};

const getTracking = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.shipmentId)) return res.status(400).json({ success: false, message: "Invalid shipment" });
    const shipment = await Shipment.findById(req.params.shipmentId);
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    if (shipment.senderId.toString() !== req.user.id) {
        if (!shipment.bookedVehicleId) return res.status(403).json({ success: false, message: "Not authorized" });
        const vehicle = await Vehicle.findById(shipment.bookedVehicleId).select("ownerId assignedDriver");
        const authorized = vehicle && (
            vehicle.ownerId.toString() === req.user.id ||
            (vehicle.assignedDriver && vehicle.assignedDriver.toString() === req.user.id)
        );
        if (!authorized) return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, status: shipment.status, tracking: shipment.tracking });
};

module.exports = { createDocument, getDocuments, reviewDocument, createReview, createSupportTicket, getSupportTickets, createDispute, getMaintenance, createMaintenance, updateTracking, getTracking };
