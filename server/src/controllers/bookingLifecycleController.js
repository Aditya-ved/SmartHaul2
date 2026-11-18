const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");
const Notification = require("../models/Notification");

const estimateFare = (weightKg) => {
    const distanceCharge = 8500;
    const weightCharge = Math.max(0, (Number(weightKg) - 1000) * 0.625);
    const serviceFee = 1000;
    return { distanceCharge, weightCharge: Math.round(weightCharge), serviceFee, total: distanceCharge + Math.round(weightCharge) + serviceFee };
};

const createBooking = async (req, res) => {
    let reservedVehicleId = null;
    let reservedWeight = 0;
    let bookingCreated = false;
    try {
        const { shipmentId, vehicleId } = req.body;
        const idempotencyKey = req.headers["idempotency-key"];
        if (!mongoose.isValidObjectId(shipmentId) || !mongoose.isValidObjectId(vehicleId)) {
            return res.status(400).json({ success: false, message: "Invalid shipment or vehicle ID" });
        }
        if (idempotencyKey) {
            const existing = await Booking.findOne({ idempotencyKey });
            if (existing) return res.status(200).json({ success: true, idempotent: true, booking: existing });
        }
        const shipment = await Shipment.findOne({ _id: shipmentId, senderId: req.user.id, status: "pending" });
        if (!shipment) return res.status(404).json({ success: false, message: "Pending shipment not found" });
        const pickupCity = shipment.pickupLocation.city.trim();
        const deliveryCity = shipment.deliveryLocation.city.trim();
        reservedWeight = shipment.weightKg;
        const vehicle = await Vehicle.findOneAndUpdate({
            _id: vehicleId,
            verificationStatus: "verified",
            availability: "available",
            status: "active",
            currentCity: new RegExp(`^${pickupCity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
            destinationCity: new RegExp(`^${deliveryCity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
            $expr: { $gte: [{ $ifNull: ["$availableCapacityKg", "$capacityKg"] }, reservedWeight] }
        }, [{
            $set: {
                availableCapacityKg: {
                    $subtract: [{ $ifNull: ["$availableCapacityKg", "$capacityKg"] }, reservedWeight]
                }
            }
        }], { new: true, updatePipeline: true });
        if (!vehicle) return res.status(409).json({ success: false, message: "Truck is unavailable" });
        reservedVehicleId = vehicle._id;

        const booking = await Booking.create({
            idempotencyKey: idempotencyKey || null,
            shipmentId, senderId: req.user.id, vehicleId, ownerId: vehicle.ownerId,
            route: { pickupCity: shipment.pickupLocation.city, deliveryCity: shipment.deliveryLocation.city },
            weightKg: shipment.weightKg, estimate: estimateFare(shipment.weightKg), pickupDate: shipment.pickupDate
        });
        await Shipment.findByIdAndUpdate(shipmentId, { status: "matched", bookedVehicleId: vehicleId });
        await Notification.create({ userId: vehicle.ownerId, type: "booking_request", title: "New booking request", message: `A ${shipment.weightKg} kg shipment is waiting for confirmation.`, link: "/dashboard" });
        bookingCreated = true;
        return res.status(201).json({ success: true, booking });
    } catch (error) {
        if (reservedVehicleId && !bookingCreated) {
            await Vehicle.updateOne({ _id: reservedVehicleId }, {
                $inc: { availableCapacityKg: reservedWeight }
            }).catch(() => undefined);
        }
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A booking for this truck and shipment already exists" });
        }
        return res.status(500).json({ success: false, message: "Unable to create booking", error: process.env.NODE_ENV === "development" ? error.message : undefined });
    }
};

const getBookings = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter = req.user.role === "individual_owner" || req.user.role === "company_admin"
        ? { ownerId: req.user.id }
        : { senderId: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("vehicleId", "vehicleNumber vehicleType")
            .populate("shipmentId")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Booking.countDocuments(filter)
    ]);
    res.status(200).json({
        success: true,
        count: bookings.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        bookings
    });
};

const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["confirmed", "picked_up", "in_transit", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid booking status" });
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.senderId.toString() !== req.user.id && booking.ownerId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const assignedVehicle = await Vehicle.findById(booking.vehicleId).select("ownerId assignedDriver");
    if (!assignedVehicle) return res.status(404).json({ success: false, message: "Assigned vehicle not found" });
    const isOwner = assignedVehicle.ownerId.toString() === req.user.id;
    const isAssignedDriver = assignedVehicle.assignedDriver?.toString() === req.user.id;
    if (status === "confirmed" && (!isOwner || req.user.role === "sender")) {
        return res.status(403).json({ success: false, message: "Only the truck owner can confirm the booking" });
    }
    if (["picked_up", "in_transit", "delivered"].includes(status) && !isOwner && !isAssignedDriver) {
        return res.status(403).json({ success: false, message: "Only the assigned owner or driver can update delivery progress" });
    }
    if (status === "cancelled" && booking.senderId.toString() !== req.user.id && !isOwner) {
        return res.status(403).json({ success: false, message: "Only the sender or truck owner can cancel this booking" });
    }
    const transitions = {
        pending_approval: ["confirmed", "cancelled"],
        confirmed: ["picked_up", "in_transit", "cancelled"],
        picked_up: ["in_transit", "cancelled"],
        in_transit: ["delivered", "cancelled"],
        delivered: [],
        cancelled: [],
        expired: []
    };
    if (!transitions[booking.status]?.includes(status)) {
        return res.status(400).json({ success: false, message: `Cannot change booking from ${booking.status} to ${status}` });
    }
    if (status === "cancelled" && booking.status !== "pending_approval" && booking.status !== "confirmed") {
        return res.status(400).json({ success: false, message: "Only pending or confirmed bookings can be cancelled" });
    }
    booking.status = status;
    if (status === "cancelled") booking.cancelledAt = new Date();
    await booking.save();
    await Shipment.findByIdAndUpdate(booking.shipmentId, {
        $set: status === "cancelled"
            ? { status: "cancelled" }
            : { status: status === "confirmed" ? "booked" : status }
    });
    if (status === "cancelled") {
        await Vehicle.findByIdAndUpdate(booking.vehicleId, [{
            $set: {
                availableCapacityKg: {
                    $min: [
                        "$capacityKg",
                        { $add: [{ $ifNull: ["$availableCapacityKg", "$capacityKg"] }, booking.weightKg] }
                    ]
                }
            }
        }], { updatePipeline: true });
    }
    if (status === "delivered") {
        await Vehicle.findByIdAndUpdate(booking.vehicleId, [{
            $set: {
                availableCapacityKg: {
                    $min: [
                        "$capacityKg",
                        { $add: [{ $ifNull: ["$availableCapacityKg", "$capacityKg"] }, booking.weightKg] }
                    ]
                }
            }
        }], { updatePipeline: true });
    }
    await Notification.create({ userId: booking.senderId, type: "booking_status", title: "Booking status updated", message: `Your booking is now ${status.replace("_", " ")}.`, link: `/tracking/${booking.shipmentId}` });
    res.status(200).json({ success: true, booking });
};

const estimate = async (req, res) => {
    const weightKg = Number(req.body.weightKg || 0);
    if (weightKg < 1) return res.status(400).json({ success: false, message: "Weight must be greater than zero" });
    res.status(200).json({ success: true, estimate: estimateFare(weightKg) });
};

module.exports = { createBooking, getBookings, updateBookingStatus, estimate, estimateFare };
