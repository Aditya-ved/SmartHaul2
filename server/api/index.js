const app = require("../src/app");
const connectDB = require("../src/config/db");

let connectionPromise;

const handler = async (req, res) => {
    const requestOrigin = req.headers.origin;
    const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    const isSmartHaulPreview =
        /^https:\/\/smart-haul2(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(requestOrigin || "");

    if (requestOrigin && (allowedOrigins.includes(requestOrigin) || isSmartHaulPreview)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,Idempotency-Key");
    }

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (!process.env.MONGODB_URI) {
        return res.status(500).json({
            success: false,
            message: "MONGODB_URI is not configured"
        });
    }

    connectionPromise ||= connectDB();
    await connectionPromise;
    return app(req, res);
};

module.exports = handler;
