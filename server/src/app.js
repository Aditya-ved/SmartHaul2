
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./routes/adminRoutes");
const platformRoutes = require("./routes/platformRoutes");
const trustOperationsRoutes = require("./routes/trustOperationsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()),
    credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
}));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SmartHaul API is running",
        timestamp: new Date()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/platform", platformRoutes);
app.use("/api/trust", trustOperationsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
