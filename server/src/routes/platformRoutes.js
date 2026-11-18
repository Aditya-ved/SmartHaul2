const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    toggleFavorite,
    getFavorites,
    getNotifications,
    markNotificationsRead,
    markNotificationRead,
    getPayments,
    getDashboardInsights,
    createOrGetConversation,
    getConversations,
    getMessages,
    sendMessage
} = require("../controllers/platformController");

router.use(protect);
router.get("/favorites", getFavorites);
router.post("/favorites", toggleFavorite);
router.get("/notifications", getNotifications);
router.patch("/notifications/read", markNotificationsRead);
router.patch("/notifications/:id/read", markNotificationRead);
router.get("/payments", getPayments);
router.get("/dashboard", getDashboardInsights);
router.get("/conversations", getConversations);
router.post("/conversations", createOrGetConversation);
router.get("/conversations/:id/messages", getMessages);
router.post("/conversations/:id/messages", sendMessage);

module.exports = router;
