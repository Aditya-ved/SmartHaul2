
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Shipment = require("../models/Shipment");
const mongoose = require("mongoose");

const checkOwnerPermission = (req, res) => {
    if (!["individual_owner", "company_admin"].includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: "Only truck owners and company admins can manage drivers"
        });
        return false;
    }

    return true;
};

const createDriver = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const driver = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            phone,
            password,
            role: "driver",
            companyId: req.user.companyId || null,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Driver registered successfully",
            driver: {
                id: driver._id,
                fullName: driver.fullName,
                email: driver.email,
                phone: driver.phone,
                role: driver.role,
                status: driver.status
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        console.error("Create driver error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to register driver"
        });
    }
};

const getMyDrivers = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const drivers = await User.find({
            role: "driver",
            createdBy: req.user.id
        })
            .select("fullName email phone role status createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: drivers.length,
            drivers
        });
    } catch (error) {
        console.error("Get drivers error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch drivers"
        });
    }
};

const deleteDriver = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver ID"
            });
        }

        const driver = await User.findOne({
            _id: id,
            role: "driver",
            createdBy: req.user.id
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        await Vehicle.updateMany(
            {
                ownerId: req.user.id,
                assignedDriver: driver._id
            },
            {
                $set: { assignedDriver: null }
            }
        );

        await User.deleteOne({ _id: driver._id });

        return res.status(200).json({
            success: true,
            message: "Driver deleted successfully"
        });
    } catch (error) {
        console.error("Delete driver error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete driver"
        });
    }
};

const getMyWork = async (req, res) => {
    try {
        if (req.user.role !== "driver") {
            return res.status(403).json({
                success: false,
                message: "Only drivers can access this information"
            });
        }

        const vehicles = await Vehicle.find({
            assignedDriver: req.user.id
        })
            .select(
                "vehicleNumber vehicleType make model currentCity destinationCity capacityKg availableCapacityKg availability status"
            )
            .lean();

        const vehicleIds = vehicles.map(vehicle => vehicle._id);

        const shipments = await Shipment.find({
            bookedVehicleId: { $in: vehicleIds },
            status: {
                $in: ["booked", "in_transit", "delivered"]
            }
        })
            .populate(
                "bookedVehicleId",
                "vehicleNumber vehicleType make model"
            )
            .populate(
                "senderId",
                "fullName phone"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            vehicles,
            vehicleCount: vehicles.length,
            shipments,
            shipmentCount: shipments.length
        });
    } catch (error) {
        console.error("Get driver work error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch driver work"
        });
    }
};

// Reset a driver's password by their creating owner
const resetDriverPassword = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;
        const { newPassword } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid driver ID"
            });
        }

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters"
            });
        }

        const driver = await User.findOne({
            _id: id,
            role: "driver",
            createdBy: req.user.id
        }).select("+password");

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        driver.password = newPassword;
        await driver.save();

        return res.status(200).json({
            success: true,
            message: "Driver password reset successfully"
        });
    } catch (error) {
        console.error("Reset driver password error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to reset driver password"
        });
    }
};

module.exports = {
    createDriver,
    getMyDrivers,
    deleteDriver,
    getMyWork,
    resetDriverPassword
};
