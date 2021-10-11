/**
 * 1. Create router, controller and schema 
 * 2. Create a middleware in model and hash the password using bcrypt library, also store in DB
 * 3. Create a method in model to create JWT Token 
 * 4. Trigger once user is created from DB to get JWT token
 * 5. For login, match user password with DB password 
 */

const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utilis/ErrorResponse");

// @desc      Register User
// @route     POST '/api/v1/auth/register'
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Send token response using helper method 
    sendTokenResponse(user, 200, res);

})


// @desc      Login User
// @route     POST '/api/v1/auth/login'
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please enter valid email/password', 400));
    }

    // Find email by ID and also include password for the user
    // Password was hidden in User model (Including here)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }


    // Password validation using mongoose method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Send token response using helper method 
    sendTokenResponse(user, 200, res);

})

const sendTokenResponse = (user, statusCode, res) => {
    // Get Token from Mongoose Method
    const token = user.getJWT();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            succes: true,
            token
        })
}