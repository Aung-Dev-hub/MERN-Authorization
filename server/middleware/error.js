class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message),
            this.statusCode = statusCode
    };
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong MongoDB ID
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Invalid JWT
    if (err.name === "JsonWebTokenError") {
        const message = `JsonWebToken is Invalid. Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //Expire JWT
    if (err.name === "TokenExpiredError") {
        const message = `JsonWebToken is Expired. Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate MongoDB Key
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;