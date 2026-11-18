const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);

    let statusCode = error.statusCode || error.status || 500;
    let message = error.message || "Internal server error";

    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    if (error.code === 11000) {
        statusCode = 409;
        message = "A duplicate record already exists";
    }

    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors).map((item) => item.message).join(", ");
    }

    if (statusCode === 500) {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = { notFound, errorHandler };
