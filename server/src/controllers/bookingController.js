
const mongoose = require("mongoose");
const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const bookTruck = async (req, res) => {
    let reservedVehicleId = null;
    let reservedWeight = 0;
    let bookingCompleted = false;

    try {
        const { shipmentId, vehicleId } = req.params;

        if (
            !mongoose.isValidObjectId(shipmentId) ||
            !mongoose.isValidObjectId(vehicleId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment or vehicle ID"
            });
        }

        const shipment = await Shipment.findOne({
            _id: shipmentId,
            senderId: req.user.id,
            status: "pending"
        });

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Pending shipment not found"
            });
        }

        reservedWeight = shipment.weightKg;

        const pickupCity = shipment.pickupLocation.city.trim();
        const deliveryCity = shipment.deliveryLocation.city.trim();

        const vehicle = await Vehicle.findOneAndUpdate(
            {
                _id: vehicleId,
                verificationStatus: "verified",
                availability: "available",
                status: "active",
                currentCity: new RegExp(
                    `^${escapeRegex(pickupCity)}$`,
                    "i"
                ),
                destinationCity: new RegExp(
                    `^${escapeRegex(deliveryCity)}$`,
                    "i"
                ),
                $expr: {
                    $gte: [
                        {
                            $ifNull: [
                                "$availableCapacityKg",
                                "$capacityKg"
                            ]
                        },
                        reservedWeight
                    ]
                }
            },
            [
                {
                    $set: {
                        availableCapacityKg: {
                            $subtract: [
                                {
                                    $ifNull: [
                                        "$availableCapacityKg",
                                        "$capacityKg"
                                    ]
                                },
                                reservedWeight
                            ]
                        }
                    }
                }
            ],
            {
                new: true,
                updatePipeline: true
            }
        );

        if (!vehicle) {
            return res.status(409).json({
                success: false,
                message: "Truck is unavailable, unverified, or does not have enough capacity"
            });
        }

        reservedVehicleId = vehicle._id;

        const updatedShipment = await Shipment.findOneAndUpdate(
            {
                _id: shipmentId,
                senderId: req.user.id,
                status: "pending"
            },
            {
                $set: {
                    status: "booked",
                    bookedVehicleId: vehicle._id,
                    bookedAt: new Date()
                }
            },
            { new: true }
        );

        if (!updatedShipment) {
            throw new Error(
                "Shipment has already been booked or is no longer pending"
            );
        }

        bookingCompleted = true;

        const existingBooking = await Booking.findOne({
            shipmentId: updatedShipment._id,
            vehicleId: vehicle._id
        });

        if (!existingBooking) {
            await Booking.create({
                shipmentId: updatedShipment._id,
                senderId: req.user.id,
                vehicleId: vehicle._id,
                ownerId: vehicle.ownerId,
                status: "confirmed",
                route: {
                    pickupCity: pickupCity,
                    deliveryCity: deliveryCity
                },
                weightKg: reservedWeight,
                estimate: {
                    distanceCharge: 8500,
                    weightCharge: Math.round(Math.max(0, reservedWeight - 1000) * 0.625),
                    serviceFee: 1000,
                    total: 9500 + Math.round(Math.max(0, reservedWeight - 1000) * 0.625)
                },
                pickupDate: shipment.pickupDate
            });

            await Notification.create({
                userId: req.user.id,
                type: "booking_confirmed",
                title: "Truck booked",
                message: `Truck ${vehicle.vehicleNumber} was booked for your shipment.`,
                link: `/tracking/${updatedShipment._id}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Truck booked successfully",
            shipment: updatedShipment,
            vehicle
        });

    } catch (error) {
        if (reservedVehicleId && !bookingCompleted) {
            try {
                await Vehicle.updateOne(
                    { _id: reservedVehicleId },
                    {
                        $inc: {
                            availableCapacityKg: reservedWeight
                        }
                    }
                );
            } catch (rollbackError) {
                console.error("Capacity rollback error:", rollbackError);
            }
        }

        console.error("Booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to book truck",
            error: error.message
        });
    }
};

module.exports = { bookTruck };
