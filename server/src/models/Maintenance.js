const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["service", "inspection", "repair", "document", "other"], default: "service" },
    title: { type: String, required: true, trim: true },
    scheduledFor: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "completed", "overdue", "cancelled"], default: "scheduled" },
    notes: { type: String, trim: true, maxlength: 1000, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
