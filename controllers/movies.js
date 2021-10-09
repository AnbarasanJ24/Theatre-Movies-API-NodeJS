const asyncHandler = require("../middleware/async");
const Movies = require('../models/Movies');
const ErrorResponse = require("../utilis/ErrorResponse");


// @desc      Get All Movies
// @route     GET '/api/v1/movies'
// @route     GET '/api/v1/theatres/:theatreid/movies'
// @access    Public
exports.getMovies = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.theatreId) {
        query = Movies.find({ 'theatre': req.params.theatreId })
    } else {
        // Populate Theatre with name and description
        query = Movies.find().populate({
            path: 'theatre',
            select: 'name description'
        })
    }

    const courses = await query;

    res.json({
        success: true,
        count: courses.length,
        data: courses
    })
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