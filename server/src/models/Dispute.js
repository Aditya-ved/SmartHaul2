const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["damage", "delay", "payment", "capacity", "conduct", "other"], required: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ["open", "under_review", "resolved", "rejected"], default: "open", index: true },
    resolution: { type: String, trim: true, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Dispute", disputeSchema);
