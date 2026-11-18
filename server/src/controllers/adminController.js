
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Notification = require("../models/Notification");

const getVehiclesByVerificationStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

        if (!["pending", "verified", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification status"
            });
        }

        const filter = {
            verificationStatus: status
        };
        const [vehicles, total] = await Promise.all([
        Vehicle.find(filter)
            .populate("ownerId", "fullName email phone")
            .populate("assignedDriver", "fullName phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Vehicle.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            vehicles
        });
    } catch (error) {
        console.error("Fetch vehicles error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch vehicles"
        });
    }
};

const getPendingVehicles = async (req, res) => {
    req.params.status = "pending";
    return getVehiclesByVerificationStatus(req, res);
};

const updateVehicleVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificationStatus } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }

        if (!["verified", "rejected"].includes(verificationStatus)) {
            return res.status(400).json({
                success: false,
                message: "Verification status must be verified or rejected"
            });
        }

        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        if (vehicle.verificationStatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending vehicles can be reviewed"
            });
        }

        vehicle.verificationStatus = verificationStatus;
        await vehicle.save();
        await Notification.create({
            userId: vehicle.ownerId,
            type: "vehicle_verification",
            title: `Vehicle ${verificationStatus}`,
            message: `Vehicle ${vehicle.vehicleNumber} was ${verificationStatus}.`,
            link: "/fleet"
        });

        return res.status(200).json({
            success: true,
            message: `Vehicle ${verificationStatus} successfully`,
            vehicle
        });
    } catch (error) {
        console.error("Vehicle verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update vehicle verification"
        });
    }
};

module.exports = {
    getPendingVehicles,
    getVehiclesByVerificationStatus,
    updateVehicleVerification
};
