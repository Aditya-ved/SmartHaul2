
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

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

        const allowedRoles = [
            "sender",
            "individual_owner",
            "company_admin"
        ];

        const selectedRole = role || "sender";

        if (!allowedRoles.includes(selectedRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration role"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            role: selectedRole
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
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
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch user profile"
        });
    }
};

const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (req.body.fullName?.trim()) user.fullName = req.body.fullName.trim();
        if (req.body.phone !== undefined) user.phone = req.body.phone.trim();
        await user.save();
        res.status(200).json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message || "Unable to update profile" });
    }
};

const requestPasswordReset = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    const user = await User.findOne({ email });
    if (user) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save({ validateBeforeSave: false });
        // The reset token should be delivered by the configured email provider.
        if (process.env.NODE_ENV !== "production") console.info(`Password reset token for ${email}: ${rawToken}`);
    }
    res.status(200).json({ success: true, message: "If the account exists, reset instructions have been sent." });
};

const resetPassword = async (req, res) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    if (!req.body.password || req.body.password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({ success: true, message: "Password reset successfully" });
};

module.exports = { register, login, getMe, updateMe, requestPasswordReset, resetPassword };
