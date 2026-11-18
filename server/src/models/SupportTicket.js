const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, enum: ["booking", "payment", "delivery", "safety", "account", "other"], default: "other" },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open", index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolution: { type: String, trim: true, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
