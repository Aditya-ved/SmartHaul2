const Favorite = require("../models/Favorite");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Shipment = require("../models/Shipment");
const Booking = require("../models/Booking");
const User = require("../models/User");

const toggleFavorite = async (req, res) => {
    const { vehicleId, pickupCity, deliveryCity } = req.body;
    if (vehicleId && !mongoose.isValidObjectId(vehicleId)) return res.status(400).json({ success: false, message: "Invalid vehicle ID" });
    if (!vehicleId && (!pickupCity || !deliveryCity)) return res.status(400).json({ success: false, message: "Provide a vehicle or route" });
    const existing = vehicleId
        ? await Favorite.findOne({ userId: req.user.id, vehicleId })
        : await Favorite.findOne({ userId: req.user.id, "route.pickupCity": pickupCity, "route.deliveryCity": deliveryCity });
    if (existing) {
        await existing.deleteOne();
        return res.status(200).json({ success: true, saved: false });
    }
    const favorite = await Favorite.create({ userId: req.user.id, vehicleId: vehicleId || null, route: { pickupCity: pickupCity || "", deliveryCity: deliveryCity || "" } });
    res.status(201).json({ success: true, saved: true, favorite });
};

const getFavorites = async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user.id }).populate("vehicleId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: favorites.length, favorites });
};

const getNotifications = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter = { userId: req.user.id };
    if (req.query.unread === "true") filter.unread = true;
    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Notification.countDocuments(filter),
        Notification.countDocuments({ userId: req.user.id, unread: true })
    ]);
    res.status(200).json({ success: true, notifications, total, unreadCount, page, pages: Math.ceil(total / limit) });
};

const markNotificationsRead = async (req, res) => {
    await Notification.updateMany({ userId: req.user.id, unread: true }, { $set: { unread: false } });
    res.status(200).json({ success: true });
};

const markNotificationRead = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid notification" });
    }
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: { unread: false } },
        { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, notification });
};

const createOrGetConversation = async (req, res) => {
    const { participantId, bookingId, subject } = req.body;
    if (!mongoose.isValidObjectId(participantId)) return res.status(400).json({ success: false, message: "Invalid participant" });
    let conversation = await Conversation.findOne({ participantIds: { $all: [req.user.id, participantId] } });
    if (!conversation) conversation = await Conversation.create({ participantIds: [req.user.id, participantId], bookingId: bookingId || null, subject: subject || "" });
    res.status(200).json({ success: true, conversation });
};

const getConversations = async (req, res) => {
    const conversations = await Conversation.find({ participantIds: req.user.id }).populate("participantIds", "fullName role").sort({ lastMessageAt: -1 });
    res.status(200).json({ success: true, conversations });
};

const getMessages = async (req, res) => {
    const conversation = await Conversation.findOne({ _id: req.params.id, participantIds: req.user.id });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    const messages = await Message.find({ conversationId: conversation._id }).populate("senderId", "fullName role").sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
};

const sendMessage = async (req, res) => {
    const conversation = await Conversation.findOne({ _id: req.params.id, participantIds: req.user.id });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    if (!req.body.body?.trim()) return res.status(400).json({ success: false, message: "Message cannot be empty" });
    const message = await Message.create({ conversationId: conversation._id, senderId: req.user.id, body: req.body.body.trim(), readBy: [req.user.id] });
    conversation.lastMessage = message.body;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    res.status(201).json({ success: true, message });
};

const createMockPayment = async (req, res) => {
    const { bookingId } = req.body;
    if (!mongoose.isValidObjectId(bookingId)) return res.status(400).json({ success: false, message: "Invalid booking" });
    const Booking = require("../models/Booking");
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.senderId.toString() !== req.user.id) return res.status(404).json({ success: false, message: "Booking not found" });
    const existing = await Payment.findOne({ bookingId });
    if (existing) return res.status(200).json({ success: true, payment: existing });
    const payment = await Payment.create({
        bookingId, senderId: req.user.id, ownerId: booking.ownerId, amount: booking.estimate.total,
        invoiceNumber: `INV-${Date.now()}`, status: "captured", provider: "mock", providerPaymentId: `MOCK-${Date.now()}`
    });
    res.status(201).json({ success: true, payment });
};

const getPayments = async (req, res) => {
    const payments = await Payment.find({ senderId: req.user.id }).populate("bookingId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, payments });
};

const getDashboardInsights = async (req, res) => {
    try {
        const role = req.user.role;
        const userId = req.user.id;

        if (role === "admin") {
            const [pending, verified, rejected, drivers, owners, sent] = await Promise.all([
                Vehicle.countDocuments({ verificationStatus: "pending" }),
                Vehicle.countDocuments({ verificationStatus: "verified" }),
                Vehicle.countDocuments({ verificationStatus: "rejected" }),
                User.countDocuments({ role: "driver", status: "active" }),
                User.countDocuments({ role: { $in: ["individual_owner", "company_admin"] }, status: "active" }),
                Shipment.countDocuments()
            ]);
            const totalVehicles = pending + verified + rejected;
            const verificationRate = totalVehicles ? Math.round((verified / totalVehicles) * 100) : 0;
            return res.status(200).json({
                success: true,
                role,
                insights: {
                    pendingVehicles: pending,
                    verifiedVehicles: verified,
                    rejectedVehicles: rejected,
                    activeDrivers: drivers,
                    activeOwners: owners,
                    totalShipments: sent,
                    verificationRate
                }
            });
        }

        if (role === "driver") {
            const vehicles = await Vehicle.find({ assignedDriver: userId }).select("_id capacityKg availableCapacityKg");
            const vehicleIds = vehicles.map((vehicle) => vehicle._id);
            const shipments = await Shipment.find({
                bookedVehicleId: { $in: vehicleIds },
                status: { $in: ["booked", "in_transit", "delivered"] }
            }).sort({ pickupDate: 1 });

            const active = shipments.filter((shipment) => ["booked", "in_transit"].includes(shipment.status)).length;
            const delivered = shipments.filter((shipment) => shipment.status === "delivered").length;
            const nextShipment = shipments.find((shipment) => ["booked", "in_transit"].includes(shipment.status)) || null;
            return res.status(200).json({
                success: true,
                role,
                insights: {
                    assignedVehicles: vehicles.length,
                    activeShipments: active,
                    deliveredShipments: delivered,
                    nextShipment
                }
            });
        }

        if (["individual_owner", "company_admin"].includes(role)) {
            const vehicles = await Vehicle.find({ ownerId: userId }).select("_id capacityKg availableCapacityKg availability");
            const vehicleIds = vehicles.map((vehicle) => vehicle._id);
            const [shipments, bookings, payments] = await Promise.all([
                Shipment.find({ bookedVehicleId: { $in: vehicleIds } }).sort({ createdAt: -1 }).limit(8),
                Booking.find({ ownerId: userId }).sort({ createdAt: -1 }).limit(20),
                Payment.find({ ownerId: userId, status: "captured" })
            ]);
            const totalCapacity = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.capacityKg || 0), 0);
            const availableCapacity = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.availableCapacityKg ?? vehicle.capacityKg ?? 0), 0);
            const utilization = totalCapacity ? Math.round(((totalCapacity - availableCapacity) / totalCapacity) * 100) : 0;
            const activeBookings = bookings.filter((booking) => !["cancelled", "delivered", "expired"].includes(booking.status)).length;
            const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
            return res.status(200).json({
                success: true,
                role,
                insights: {
                    totalVehicles: vehicles.length,
                    availableVehicles: vehicles.filter((vehicle) => vehicle.availability === "available").length,
                    activeBookings,
                    utilization,
                    revenue,
                    recentShipments: shipments
                }
            });
        }

        const [shipments, bookings] = await Promise.all([
            Shipment.find({ senderId: userId }).sort({ createdAt: -1 }).limit(8),
            Booking.find({ senderId: userId }).sort({ createdAt: -1 }).limit(20)
        ]);
        const activeShipments = shipments.filter((shipment) => ["matching", "matched", "booked", "in_transit"].includes(shipment.status)).length;
        const delivered = shipments.filter((shipment) => shipment.status === "delivered").length;
        const pendingBookings = bookings.filter((booking) => booking.status === "pending_approval").length;
        return res.status(200).json({
            success: true,
            role,
            insights: {
                totalShipments: shipments.length,
                activeShipments,
                deliveredShipments: delivered,
                pendingBookings,
                recentShipments: shipments
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Unable to load dashboard insights" });
    }
};

module.exports = { toggleFavorite, getFavorites, getNotifications, markNotificationsRead, markNotificationRead, getPayments, getDashboardInsights, createOrGetConversation, getConversations, getMessages, sendMessage, createMockPayment };
