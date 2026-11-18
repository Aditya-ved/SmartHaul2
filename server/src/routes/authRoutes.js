
const express = require("express");

const {
    register,
    login,
    getMe,
    updateMe,
    requestPasswordReset,
    resetPassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/forgot-password", requestPasswordReset);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;
