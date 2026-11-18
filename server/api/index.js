const app = require("../src/app");
const connectDB = require("../src/config/db");

let connectionPromise;

const handler = async (req, res) => {
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
