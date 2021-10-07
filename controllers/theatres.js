
const asyncHandler = require("../middleware/async");
const Theatre = require("../models/Theatre");
const ErrorResponse = require("../utilis/ErrorResponse");


// @desc      Get All Theatres
// @route     GET '/api/v1/theatres'
// @access    Public
exports.getTheatres = asyncHandler(async (req, res, next) => {
    const data = await Theatre.find();

    res.status(200).json({
        success: true,
        data: data
    });
})

// @desc      Get Single Theatre
// @route     GET '/api/v1/theatres/:id
// @access    Private
exports.getTheatre = asyncHandler(async (req, res, next) => {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
        return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: theatre
    })
})

// @desc      POST new Theatre
// @route     POST '/api/v1/theatres'
// @access    Private
exports.postTheatre = asyncHandler(async (req, res, next) => {
    const body = await Theatre.create(req.body);
    res.status(201).json({
        success: true,
        data: body
    })
})

// @desc      Update Single Theatre
// @route     PUT '/api/v1/theatres/:id
// @access    Private
exports.updateTheatre = asyncHandler(async (req, res, next) => {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!theatre) {
        return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
    }

    res.status(200).send({
        success: true,
        data: theatre
    })
})

// @desc      Delete Single Theatre
// @route     DELETE '/api/v1/theatres/:id
// @access    Private
exports.deleteTheatre = asyncHandler(async (req, res, next) => {
    try {
        const theatre = await Theatre.findByIdAndDelete(req.params.id);
        if (!theatre) {
            return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
        }

        res.status(200).send({
            success: true,
            data: `Deleted theatre details with id ${req.params.id}`
        })

    } catch (err) {
        next(err);
    }
})
