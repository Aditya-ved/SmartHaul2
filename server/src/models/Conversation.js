const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null, index: true },
    participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    subject: { type: String, trim: true, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessage: { type: String, trim: true, default: "" }
}, { timestamps: true });

conversationSchema.index({ participantIds: 1, updatedAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
