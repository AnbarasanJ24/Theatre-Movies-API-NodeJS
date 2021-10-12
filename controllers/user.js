const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utilis/ErrorResponse");
const crypto = require("crypto");


// @desc      Get All Users
// @route     GET '/api/v1/auth/users'
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);

})

// @desc      Get Single User
// @route     GET '/api/v1/auth/users/:id'
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });

})


// @desc      Create a User
// @route     POST '/api/v1/auth/users'
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body)

    res.status(201).json({
        success: true,
        data: user
    });

})

// @desc      Update a User
// @route     PUT '/api/v1/auth/users/:id'
// @access    Private/Admin
exports.updateeUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse('User not found', 404));
    }


    await user.save();
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: updatedUser
    });


})


// @desc      Delete a  User
// @route     DELETE '/api/v1/auth/user/:id'
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        next(new ErrorResponse('User not found', 404));
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: `User with Id ${req.params.id} is deleted!`
    });

})
