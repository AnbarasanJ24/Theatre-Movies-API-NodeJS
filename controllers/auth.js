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
const sendEmail = require("../utilis/SendEmail");
const crypto = require("crypto");

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

// @desc      Logout User
// @route     GET '/api/v1/auth/logout'
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        succes: true,
        data: {}
    })
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

// @desc      Get Current User
// @route     GET '/api/v1/auth/me'
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        succes: true,
        data: user
    })
})

// @desc      Forgot Password
// @route     GET '/api/v1/auth/forgotpassword'
// @access    Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse(`User not found with this ${req.body.email} email`, 404));
    }

    const resetToken = user.getResetPasswordToken();
    await User.findByIdAndUpdate(user.id.toString(), user);

    // Create Reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/vi/auth/resetPassword/${resetToken}`;

    const message = `
    Hi 

    Please use the belowo link to reset your password!.

    ${resetURL};

    Thanks
    Thea Team

    `;

    // Sending Email to user
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset | Thea',
            message
        })
        res.status(200).json({
            succes: true,
            data: 'Email sent'
        })
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await User.findByIdAndUpdate(user.id.toString(), user);
        return next(new ErrorResponse('Error sending an email', 500));
    }



})

// @desc      Reset Password
// @route     PUT '/api/v1/auth/resetpassword/:resetToken'
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    const resetPassswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: resetPassswordToken,
        resetPasswordExpire: { $gte: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set New password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await User.findByIdAndUpdate(user.id.toString(), user);
    // Send token response using helper method 
    sendTokenResponse(user, 200, res);
})


// @desc      Update User Details
// @route     PUT '/api/v1/auth/updateDetails'
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        succes: true,
        data: user
    })
})


// @desc      Update User Password
// @route     PUT '/api/v1/auth/updatePassword'
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Invalid Password', 400))
    }

    user.password = req.body.newPassword;
    await user.save();

    await User.findByIdAndUpdate(user.id.toString(), user);

    sendTokenResponse(user, 200, res);
})