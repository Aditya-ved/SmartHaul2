const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR" },
    provider: { type: String, enum: ["razorpay", "upi", "cash", "mock"], default: "mock" },
    providerPaymentId: { type: String, default: "" },
    status: { type: String, enum: ["pending", "authorized", "captured", "failed", "refunded"], default: "pending", index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    refundedAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
