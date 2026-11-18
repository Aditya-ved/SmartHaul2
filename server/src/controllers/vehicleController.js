
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const mongoose = require("mongoose");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const checkOwnerPermission = (req, res) => {
    if (!["individual_owner", "company_admin"].includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: "Only truck owners and company admins can manage vehicles"
        });
        return false;
    }

    return true;
};

const addVehicle = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const {
            vehicleNumber,
            vehicleType,
            make,
            model,
            manufacturingYear,
            capacityKg,
            availableCapacityKg,
            currentCity,
            destinationCity,
            registrationExpiry,
            insuranceExpiry,
            description
        } = req.body;

        if (!vehicleNumber || !vehicleType || !capacityKg) {
            return res.status(400).json({
                success: false,
                message: "Vehicle number, type and capacity are required"
            });
        }

        if (
            availableCapacityKg !== undefined &&
            (
                Number(availableCapacityKg) < 0 ||
                Number(availableCapacityKg) > Number(capacityKg)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Available capacity must be between 0 and total capacity"
            });
        }

        const existingVehicle = await Vehicle.findOne({
            vehicleNumber: vehicleNumber.toUpperCase().trim()
        });

        if (existingVehicle) {
            return res.status(409).json({
                success: false,
                message: "This vehicle is already registered"
            });
        }

        const vehicle = await Vehicle.create({
            vehicleNumber,
            vehicleType,
            make,
            model,
            manufacturingYear,
            capacityKg,
            availableCapacityKg:
                availableCapacityKg !== undefined
                    ? availableCapacityKg
                    : capacityKg,
            currentCity,
            destinationCity,
            registrationExpiry,
            insuranceExpiry,
            description,
            ownerId: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Vehicle registered successfully",
            vehicle
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This vehicle is already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to register vehicle",
            error: error.message
        });
    }
};

const getMyVehicles = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const vehicles = await Vehicle.find({
            ownerId: req.user.id
        })
            .populate("assignedDriver", "fullName email phone status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch vehicles",
            error: error.message
        });
    }
};

const updateVehicle = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }

        const vehicle = await Vehicle.findOne({
            _id: id,
            ownerId: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        const allowedFields = [
            "vehicleNumber",
            "vehicleType",
            "make",
            "model",
            "manufacturingYear",
            "capacityKg",
            "availableCapacityKg",
            "currentCity",
            "destinationCity",
            "registrationExpiry",
            "insuranceExpiry",
            "description",
            "availability",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                vehicle[field] = req.body[field];
            }
        });

        if (
            vehicle.availableCapacityKg !== null &&
            vehicle.availableCapacityKg !== undefined &&
            (
                vehicle.availableCapacityKg < 0 ||
                vehicle.availableCapacityKg > vehicle.capacityKg
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Available capacity must be between 0 and total capacity"
            });
        }

        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Vehicle registration number already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update vehicle",
            error: error.message
        });
    }
};

const getPublicVehicles = async (req, res) => {
    try {
        const { pickupCity, deliveryCity, vehicleType, search, page = 1, limit = 12 } = req.query;
        const filter = {
            verificationStatus: "verified",
            availability: "available",
            status: "active"
        };
        if (pickupCity) filter.currentCity = new RegExp(`^${escapeRegex(pickupCity.trim())}$`, "i");
        if (deliveryCity) filter.destinationCity = new RegExp(`^${escapeRegex(deliveryCity.trim())}$`, "i");
        if (vehicleType) filter.vehicleType = vehicleType;
        if (search) {
            filter.$or = [
                { vehicleNumber: new RegExp(escapeRegex(search.trim()), "i") },
                { make: new RegExp(escapeRegex(search.trim()), "i") },
                { model: new RegExp(escapeRegex(search.trim()), "i") }
            ];
        }
        const numericLimit = Math.min(Number(limit) || 12, 50);
        const numericPage = Math.max(Number(page) || 1, 1);
        const [vehicles, total] = await Promise.all([
            Vehicle.find(filter).populate("ownerId", "fullName").sort({ createdAt: -1 }).skip((numericPage - 1) * numericLimit).limit(numericLimit),
            Vehicle.countDocuments(filter)
        ]);
        return res.status(200).json({ success: true, count: vehicles.length, total, page: numericPage, pages: Math.ceil(total / numericLimit), vehicles });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch public vehicles" });
    }
};

const getPublicVehicleById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid vehicle ID" });
        const vehicle = await Vehicle.findOne({ _id: req.params.id, verificationStatus: "verified" }).populate("ownerId", "fullName");
        if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
        return res.status(200).json({ success: true, vehicle });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch vehicle" });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }

        const vehicle = await Vehicle.findOneAndDelete({
            _id: id,
            ownerId: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete vehicle",
            error: error.message
        });
    }
};

const assignDriver = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;
        const { driverId } = req.body;

        if (
            !mongoose.isValidObjectId(id) ||
            !mongoose.isValidObjectId(driverId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID or driver ID"
            });
        }

        const vehicle = await Vehicle.findOne({
            _id: id,
            ownerId: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        if (vehicle.availability === "on_trip") {
            return res.status(400).json({
                success: false,
                message: "Cannot change driver while vehicle is on a trip"
            });
        }

        if (vehicle.assignedDriver) {
            return res.status(400).json({
                success: false,
                message: "A driver is already assigned to this vehicle. Remove the current driver first."
            });
        }

        const driver = await User.findOne({
            _id: driverId,
            role: "driver",
            createdBy: req.user.id,
            status: "active"
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Active driver not found in your driver list"
            });
        }

        const existingAssignment = await Vehicle.findOne({
            assignedDriver: driver._id
        });

        if (existingAssignment) {
            return res.status(409).json({
                success: false,
                message: "This driver is already assigned to another vehicle"
            });
        }

        vehicle.assignedDriver = driver._id;
        await vehicle.save();

        await vehicle.populate(
            "assignedDriver",
            "fullName email phone status"
        );

        return res.status(200).json({
            success: true,
            message: "Driver assigned successfully",
            vehicle
        });
    } catch (error) {
        console.error("Assign driver error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to assign driver",
            error: error.message
        });
    }
};

const removeDriver = async (req, res) => {
    try {
        if (!checkOwnerPermission(req, res)) return;

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }

        const vehicle = await Vehicle.findOne({
            _id: id,
            ownerId: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        if (vehicle.availability === "on_trip") {
            return res.status(400).json({
                success: false,
                message: "Cannot remove driver while vehicle is on a trip"
            });
        }

        if (!vehicle.assignedDriver) {
            return res.status(400).json({
                success: false,
                message: "No driver is assigned to this vehicle"
            });
        }

        vehicle.assignedDriver = null;
        await vehicle.save();

        return res.status(200).json({
            success: true,
            message: "Driver removed from vehicle successfully",
            vehicle
        });
    } catch (error) {
        console.error("Remove driver error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove driver",
            error: error.message
        });
    }
};

module.exports = {
    addVehicle,
    getMyVehicles,
    getPublicVehicles,
    getPublicVehicleById,
    updateVehicle,
    deleteVehicle,
    assignDriver,
    removeDriver
};
