const mongoose = require("mongoose");

const verificationDocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    type: { type: String, enum: ["aadhaar", "pan", "driving_license", "vehicle_rc", "insurance", "permit", "fitness", "puc", "other"], required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewerNote: { type: String, trim: true, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("VerificationDocument", verificationDocumentSchema);
