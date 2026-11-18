
const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        pickupLocation: {
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            pincode: { type: String, required: true, trim: true }
        },

        deliveryLocation: {
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            pincode: { type: String, required: true, trim: true }
        },

        goodsType: {
            type: String,
            required: true,
            trim: true
        },

        weightKg: {
            type: Number,
            required: true,
            min: 1
        },

        dimensions: {
            lengthCm: { type: Number, min: 0 },
            widthCm: { type: Number, min: 0 },
            heightCm: { type: Number, min: 0 }
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },

        pickupDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "matching",
                "matched",
                "booked",
                "picked_up",
                "in_transit",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        },

        bookedVehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            default: null
        },

        bookedAt: {
            type: Date,
            default: null
        },
        tracking: {
            currentLocation: {
                address: { type: String, trim: true, default: "" },
                latitude: { type: Number, default: null },
                longitude: { type: Number, default: null },
                updatedAt: { type: Date, default: null }
            },
            estimatedArrival: { type: Date, default: null }
        }
    },
    {
        timestamps: true
    }
);

shipmentSchema.index({ senderId: 1, createdAt: -1 });
shipmentSchema.index({
    "pickupLocation.city": 1,
    "deliveryLocation.city": 1
});

module.exports = mongoose.model("Shipment", shipmentSchema);
