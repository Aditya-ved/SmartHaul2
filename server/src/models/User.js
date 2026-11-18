
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            type: String,
            trim: true,
            default: null
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },
        role: {
            type: String,
            enum: [
                "sender",
                "individual_owner",
                "company_admin",
                "driver",
                "admin"
            ],
            required: true,
            default: "sender"
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["active", "suspended", "pending"],
            default: "active"
        },
        lastLoginAt: {
            type: Date,
            default: null
        },
        resetPasswordToken: {
            type: String,
            default: null,
            select: false
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
            select: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
