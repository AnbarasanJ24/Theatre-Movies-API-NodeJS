const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utilis/ErrorResponse");
const Review = require("../models/Review");
const Theatre = require("../models/Theatre");


// @desc      Get All Reviews
// @route     GET '/api/v1/reviews'
// @route     GET '/api/v1/theatres/:theatreid/reviews'
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.theatreId) {
        const review = await Review.find({ 'theatre': req.params.theatreId })

        res.json({
            success: true,
            count: review.length,
            data: review
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
})


// @desc      Get Single Review
// @route     GET '/api/v1/reviews/:id'
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'theatre',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse('Review Not found', 404));
    }

    res.status(200).json({
        success: true,
        data: review
    })

})


// @desc      Create Review
// @route     POST '/api/v1/theatre/:theatreId/reviews'
// @access    Private/User
exports.createReview = asyncHandler(async (req, res, next) => {

    req.body.theatre = req.params.theatreId;
    req.body.user = req.user.id;

    const theatre = await Theatre.findById(req.params.theatreId);
    if (!theatre) {
        return next(new ErrorResponse('Theatre Not found', 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    })

})

// @desc      Update Review
// @route     PUT '/api/v1/reviews/:id'
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse('Review Not found', 404));
    }
    // Make sure review is created by same user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to update this review`, 401));
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: updatedReview
    })

})

// @desc      Delete Review
// @route     DELETE '/api/v1/reviews/:id'
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse('Review Not found', 404));
    }

    // Make sure review is created by same user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to update this review`, 401));
    }


    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: `Review with id ${req.params.id} is deleted`
    })

})