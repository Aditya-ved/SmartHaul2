
const mongoose = require("mongoose");
const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

const createShipment = async (req, res) => {
    try {
        const {
            pickupLocation,
            deliveryLocation,
            goodsType,
            weightKg,
            dimensions,
            description,
            pickupDate
        } = req.body;

        if (
            !pickupLocation ||
            !deliveryLocation ||
            !goodsType ||
            !weightKg ||
            !pickupDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required shipment details"
            });
        }

        const pickupPincode = String(pickupLocation.pincode || "").trim();
        const deliveryPincode = String(deliveryLocation.pincode || "").trim();
        if (!/^[0-9]{6}$/.test(pickupPincode) || !/^[0-9]{6}$/.test(deliveryPincode)) {
            return res.status(400).json({
                success: false,
                message: "Pickup and delivery PIN codes must contain exactly 6 digits"
            });
        }
        if (Number(weightKg) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Shipment weight must be greater than zero"
            });
        }
        if (new Date(pickupDate).getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Pickup date cannot be in the past"
            });
        }

        const shipment = await Shipment.create({
            senderId: req.user.id,
            pickupLocation,
            deliveryLocation,
            goodsType,
            weightKg,
            dimensions,
            description,
            pickupDate
        });

        return res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            shipment
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create shipment"
        });
    }
};

const getMyShipments = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        let filter = { senderId: req.user.id };
        if (["individual_owner", "company_admin"].includes(req.user.role)) {
            const vehicleIds = await Vehicle.find({ ownerId: req.user.id }).distinct("_id");
            filter = {
                $or: [
                    { senderId: req.user.id },
                    { bookedVehicleId: { $in: vehicleIds } }
                ]
            };
        }
        if (req.query.status) filter.status = req.query.status;

        const [shipments, total] = await Promise.all([
        Shipment.find(filter)
            .populate("bookedVehicleId", "vehicleNumber vehicleType make model")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Shipment.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: shipments.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            shipments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shipments"
        });
    }
};

const getShipmentById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        let filter = { _id: req.params.id, senderId: req.user.id };
        if (["individual_owner", "company_admin"].includes(req.user.role)) {
            const vehicleIds = await Vehicle.find({ ownerId: req.user.id }).distinct("_id");
            filter = { _id: req.params.id, $or: [{ senderId: req.user.id }, { bookedVehicleId: { $in: vehicleIds } }] };
        }
        const shipment = await Shipment.findOne(filter).populate(
            "bookedVehicleId",
            "vehicleNumber vehicleType make model"
        );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        return res.status(200).json({
            success: true,
            shipment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch shipment"
        });
    }
};

const updateShipment = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        const shipment = await Shipment.findOne({
            _id: req.params.id,
            senderId: req.user.id
        });

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        if (shipment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending shipments can be updated"
            });
        }

        const allowedFields = [
            "pickupLocation",
            "deliveryLocation",
            "goodsType",
            "weightKg",
            "dimensions",
            "description",
            "pickupDate"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                shipment[field] = req.body[field];
            }
        });

        if (req.body.pickupLocation?.pincode && !/^[0-9]{6}$/.test(String(req.body.pickupLocation.pincode))) {
            return res.status(400).json({ success: false, message: "Pickup PIN code must contain exactly 6 digits" });
        }
        if (req.body.deliveryLocation?.pincode && !/^[0-9]{6}$/.test(String(req.body.deliveryLocation.pincode))) {
            return res.status(400).json({ success: false, message: "Delivery PIN code must contain exactly 6 digits" });
        }
        if (req.body.pickupDate && new Date(req.body.pickupDate).getTime() < Date.now()) {
            return res.status(400).json({ success: false, message: "Pickup date cannot be in the past" });
        }

        await shipment.save();

        return res.status(200).json({
            success: true,
            message: "Shipment updated successfully",
            shipment
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update shipment"
        });
    }
};

const cancelShipment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        let cancelledShipment;
        await session.withTransaction(async () => {
            const shipment = await Shipment.findOne({
                _id: req.params.id,
                senderId: req.user.id
            }).session(session);

            if (!shipment) {
                const error = new Error("Shipment not found");
                error.statusCode = 404;
                throw error;
            }

            if (!["pending", "matching", "matched", "booked"].includes(shipment.status)) {
                const error = new Error("This shipment can no longer be cancelled");
                error.statusCode = 400;
                throw error;
            }

            if (shipment.bookedVehicleId) {
                await Vehicle.findByIdAndUpdate(
                    shipment.bookedVehicleId,
                    [{
                        $set: {
                            availableCapacityKg: {
                                $min: [
                                    "$capacityKg",
                                    {
                                        $add: [
                                            { $ifNull: ["$availableCapacityKg", "$capacityKg"] },
                                            shipment.weightKg
                                        ]
                                    }
                                ]
                            }
                        }
                    }],
                    { session, updatePipeline: true }
                );
            }

            shipment.status = "cancelled";
            await shipment.save({ session });
            cancelledShipment = shipment;
            await Booking.updateMany(
                { shipmentId: shipment._id, status: { $nin: ["cancelled", "delivered"] } },
                { $set: { status: "cancelled", cancelledAt: new Date() } },
                { session }
            );
        });

        return res.status(200).json({
            success: true,
            message: "Shipment cancelled successfully",
            shipment: cancelledShipment
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to cancel shipment"
        });
    } finally {
        await session.endSession();
    }
};

const updateShipmentStatus = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { id } = req.params;
        const { status: nextStatus } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        if (!["in_transit", "delivered"].includes(nextStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment status"
            });
        }

        let updatedShipment;

        await session.withTransaction(async () => {
            const shipment = await Shipment.findById(id).session(session);

            if (!shipment) {
                const error = new Error("Shipment not found");
                error.statusCode = 404;
                throw error;
            }

            if (!shipment.bookedVehicleId) {
                const error = new Error(
                    "No truck is assigned to this shipment"
                );
                error.statusCode = 400;
                throw error;
            }

            const vehicle = await Vehicle.findById(
                shipment.bookedVehicleId
            ).session(session);

            if (!vehicle) {
                const error = new Error("Assigned vehicle not found");
                error.statusCode = 404;
                throw error;
            }

            const isOwner =
                ["individual_owner", "company_admin"].includes(req.user.role) &&
                String(vehicle.ownerId) === String(req.user.id);

            const isAssignedDriver =
                req.user.role === "driver" &&
                String(vehicle.assignedDriver) === String(req.user.id);

            if (!isOwner && !isAssignedDriver) {
                const error = new Error(
                    "Only the assigned truck owner or driver can update this shipment"
                );
                error.statusCode = 403;
                throw error;
            }

            const allowedTransitions = {
                booked: "in_transit",
                in_transit: "delivered"
            };

            if (allowedTransitions[shipment.status] !== nextStatus) {
                const error = new Error(
                    `Cannot change shipment from ${shipment.status} to ${nextStatus}`
                );
                error.statusCode = 400;
                throw error;
            }

            updatedShipment = await Shipment.findOneAndUpdate(
                {
                    _id: id,
                    status: shipment.status
                },
                {
                    $set: {
                        status: nextStatus
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );

            if (!updatedShipment) {
                const error = new Error(
                    "Shipment status changed. Refresh and try again."
                );
                error.statusCode = 409;
                throw error;
            }

            if (nextStatus === "delivered") {
                const updatedVehicle = await Vehicle.findOneAndUpdate(
                    { _id: vehicle._id },
                    [
                        {
                            $set: {
                                availableCapacityKg: {
                                    $min: [
                                        "$capacityKg",
                                        {
                                            $add: [
                                                {
                                                    $ifNull: [
                                                        "$availableCapacityKg",
                                                        "$capacityKg"
                                                    ]
                                                },
                                                shipment.weightKg
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    {
                        new: true,
                        session,
                        updatePipeline: true
                    }
                );

                if (!updatedVehicle) {
                    throw new Error(
                        "Failed to restore truck capacity"
                    );
                }
            }
        });

        await updatedShipment.populate(
            "bookedVehicleId",
            "vehicleNumber vehicleType make model"
        );

        await Notification.create({
            userId: updatedShipment.senderId,
            type: "shipment_status",
            title: nextStatus === "delivered" ? "Shipment delivered" : "Shipment in transit",
            message: `Shipment ${updatedShipment._id} is now ${nextStatus.replaceAll("_", " ")}.`,
            link: `/tracking/${updatedShipment._id}`
        });

        return res.status(200).json({
            success: true,
            message:
                nextStatus === "delivered"
                    ? "Shipment delivered and truck capacity restored"
                    : "Shipment status updated to in_transit",
            shipment: updatedShipment
        });

    } catch (error) {
        console.error("Shipment status update error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update shipment status"
        });
    } finally {
        await session.endSession();
    }
};

module.exports = {
    createShipment,
    getMyShipments,
    getShipmentById,
    updateShipment,
    cancelShipment,
    updateShipmentStatus
};
