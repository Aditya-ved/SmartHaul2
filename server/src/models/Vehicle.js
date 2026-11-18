
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        vehicleNumber: {
            type: String,
            required: [true, "Vehicle registration number is required"],
            unique: true,
            uppercase: true,
            trim: true
        },

        vehicleType: {
            type: String,
            required: true,
            enum: [
                "mini_truck",
                "pickup",
                "light_truck",
                "heavy_truck",
                "container_truck",
                "trailer",
                "other"
            ]
        },

        make: {
            type: String,
            trim: true
        },

        model: {
            type: String,
            trim: true
        },

        manufacturingYear: {
            type: Number,
            min: 1980,
            max: 2100
        },

        capacityKg: {
            type: Number,
            required: [true, "Vehicle capacity is required"],
            min: [1, "Capacity must be greater than zero"]
        },

        availableCapacityKg: {
            type: Number,
            min: [0, "Available capacity cannot be negative"],
            default: null
        },

        currentCity: {
            type: String,
            trim: true,
            default: ""
        },

        destinationCity: {
            type: String,
            trim: true,
            default: ""
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        assignedDriver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        availability: {
            type: String,
            enum: ["available", "on_trip", "unavailable"],
            default: "available"
        },

        status: {
            type: String,
            enum: ["active", "inactive", "maintenance"],
            default: "active"
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        },

        registrationExpiry: {
            type: Date
        },

        insuranceExpiry: {
            type: Date
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

vehicleSchema.index({ ownerId: 1, availability: 1 });
vehicleSchema.index({ currentCity: 1, destinationCity: 1, availability: 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
