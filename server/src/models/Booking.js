const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    idempotencyKey: { type: String, trim: true, default: null, index: true },
    shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending_approval", "confirmed", "picked_up", "in_transit", "delivered", "cancelled", "expired"],
        default: "pending_approval",
        index: true
    },
    route: {
        pickupCity: { type: String, required: true },
        deliveryCity: { type: String, required: true }
    },
    weightKg: { type: Number, required: true, min: 1 },
    estimate: {
        distanceCharge: { type: Number, default: 0 },
        weightCharge: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
        total: { type: Number, required: true, min: 0 }
    },
    pickupDate: { type: Date, required: true },
    cancelledAt: { type: Date, default: null },
    cancellationReason: { type: String, trim: true, default: "" }
}, { timestamps: true });

bookingSchema.index({ senderId: 1, createdAt: -1 });
bookingSchema.index({ ownerId: 1, status: 1 });
bookingSchema.index({ shipmentId: 1, vehicleId: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
