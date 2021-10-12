const asyncHandler = require("../middleware/async");
const Movies = require('../models/Movies');
const Theatre = require("../models/Theatre");
const ErrorResponse = require("../utilis/ErrorResponse");


// @desc      Get All Movies
// @route     GET '/api/v1/movies'
// @route     GET '/api/v1/theatres/:theatreid/movies'
// @access    Public
exports.getMovies = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.theatreId) {
        const courses = await Movies.find({ 'theatre': req.params.theatreId })

        res.json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
})

// @desc      Get Singe Movie
// @route     GET '/api/v1/movies/:id'
// @access    Public
exports.getMovie = asyncHandler(async (req, res, next) => {

    const movie = await Movies.findById(req.params.id).populate({
        path: 'theatre',
        select: 'name'
    });

    if (!movie) {
        return next(new ErrorResponse(`Movie not found with Id ${req.params.id}`, 404))
    }

    res.json({
        success: true,
        data: movie
    })
})

// @desc      Create Singe Movie
// @route     POST '/api/v1/theatre/:theatreid/movies'
// @access    Private
exports.postMovie = asyncHandler(async (req, res, next) => {
    req.body.theatre = req.params.theatreId;
    req.body.user = req.user;

    const theatre = await Theatre.findById(req.params.theatreId);

    if (!theatre) {
        return next(new ErrorResponse('Theatre not found', 404));
    }
    // Allow create only for Theatre publisher
    if (theatre.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to create movie `, 401));
    }

    const movie = await Movies.create(req.body);

    res.status(200).json({
        success: true,
        data: movie
    })
})


// @desc      Update a Movie
// @route     PUT '/api/v1/movies/:id'
// @access    Private
exports.updateMovie = asyncHandler(async (req, res, next) => {

    const movie = await Movies.findById(req.params.id);

    if (!movie) {
        return next(new ErrorResponse('Movie not found', 404));
    }
    // Allow create only for Theatre publisher
    if (movie.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to update this movie `, 401));
    }


    const updateMovie = await Movies.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: updateMovie
    })
})


// @desc      Delete a Movie
// @route     DELETE '/api/v1/movies/:id'
// @access    Private
exports.deleteMovie = asyncHandler(async (req, res, next) => {

    const movie = await Movies.findById(req.params.id);

    if (!movie) {
        return next(new ErrorResponse('Movie not found', 404));
    }
    // Allow create only for Theatre publisher
    if (movie.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to delete this movie `, 401));
    }

    await movie.remove();

    res.status(200).json({
        success: true,
        data: `Movie with id ${req.params.id} is deleted !`
    })
})