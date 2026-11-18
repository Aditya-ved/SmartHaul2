
const mongoose = require("mongoose");
const Shipment = require("../models/Shipment");
const Vehicle = require("../models/Vehicle");

const findMatchingVehicles = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(shipmentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment ID"
            });
        }

        const shipment = await Shipment.findOne({
            _id: shipmentId,
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
                message: "Only pending shipments can be matched"
            });
        }

        const pickupCity = shipment.pickupLocation.city.trim().toLowerCase();
        const deliveryCity = shipment.deliveryLocation.city.trim().toLowerCase();

        const vehicles = await Vehicle.find({
            verificationStatus: "verified",
            availability: "available",
            status: "active",
            $or: [
                { availableCapacityKg: { $gte: shipment.weightKg } },
                {
                    availableCapacityKg: null,
                    capacityKg: { $gte: shipment.weightKg }
                }
            ]
        }).populate("ownerId", "fullName phone");

        const normalizeCity = (value) => value?.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const normalizedPickup = normalizeCity(pickupCity);
        const normalizedDelivery = normalizeCity(deliveryCity);

        const matchingVehicles = vehicles
            .map((vehicle) => {
                const vehiclePickup = normalizeCity(vehicle.currentCity);
                const vehicleDestination = normalizeCity(vehicle.destinationCity);
                const exactPickup = vehiclePickup === normalizedPickup;
                const exactDestination = vehicleDestination === normalizedDelivery;
                const pickupCompatible = exactPickup || vehiclePickup?.includes(normalizedPickup) || normalizedPickup?.includes(vehiclePickup);
                const destinationCompatible = exactDestination || vehicleDestination?.includes(normalizedDelivery) || normalizedDelivery?.includes(vehicleDestination);

                if (!pickupCompatible || !destinationCompatible) return null;

                const routeScore = (exactPickup ? 50 : 25) + (exactDestination ? 50 : 25);
                const availableCapacity = vehicle.availableCapacityKg || vehicle.capacityKg;
                const capacityRatio = Math.min(100, (availableCapacity / shipment.weightKg) * 10);
                return {
                    vehicle,
                    matchScore: Math.round(routeScore + capacityRatio),
                    capacityFit: availableCapacity
                };
            })
            .filter(Boolean)
            .sort((first, second) => second.matchScore - first.matchScore)
            .map(({ vehicle, matchScore, capacityFit }) => ({
                ...vehicle.toObject(),
                matchScore,
                capacityFit
            }));

        return res.status(200).json({
            success: true,
            count: matchingVehicles.length,
            shipment: {
                id: shipment._id,
                pickupCity: shipment.pickupLocation.city,
                deliveryCity: shipment.deliveryLocation.city,
                weightKg: shipment.weightKg
            },
            matches: matchingVehicles
        });

    } catch (error) {
        console.error("Matching error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to find matching vehicles"
        });
    }
};

module.exports = { findMatchingVehicles };
