const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    route: {
        pickupCity: { type: String, trim: true, default: "" },
        deliveryCity: { type: String, trim: true, default: "" }
    }
}, { timestamps: true });

favoriteSchema.index({ userId: 1, vehicleId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
