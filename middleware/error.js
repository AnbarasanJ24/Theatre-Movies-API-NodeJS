const ErrorResponse = require("../utilis/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    console.log("Error", err)
    let error = { ...err };
    error.message = err.message;

    // Incorrect Id error
    if (err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 400);
    }

    // Duplicate Field Error
    if (err.code === 11000) {
        const message = `Duplicate value entered at ${err.keyValue.name}`;
        error = new ErrorResponse(message, 400)
    }

    // Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    })
}

module.exports = errorHandler;