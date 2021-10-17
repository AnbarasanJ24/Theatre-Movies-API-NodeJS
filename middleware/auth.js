const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utilis/ErrorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');

/* Get Token from Header
=========================== */
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies) {
        token = req.cookies;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorize to access the route', 401));
    }

    // Verify token 
    try {

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();

    } catch (err) {
        return next(new ErrorResponse('Not authorize to access the route', 401));
    }


});



/* Checking Role access
=========================== */
exports.authorize = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role ${req.user.id} is not authorized to access this route`, 403));
        }
        next();
    }
}

