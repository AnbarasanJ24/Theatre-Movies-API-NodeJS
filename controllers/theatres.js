
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utilis/ErrorResponse");
const Theatre = require("../models/Theatre");

const path = require('path');


// @desc      Get All Theatres
// @route     GET '/api/v1/theatres'
// @access    Public
exports.getTheatres = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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

    // Added user to the request bod
    req.body.user = req.user.id;


    // Check for theatre details added by publisher role
    const publishedTheatre = await Theatre.findOne({ user: req.user.id });

    if (publishedTheatre && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} has already created a theatre details`, 400));
    }


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
    let theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
        return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
    }

    // Allow update only for Theatre publisher
    if (theatre.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to update this movie`, 401));
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).send({
        success: true,
        data: theatre
    })
})

// @desc      Delete Single Theatre
// @route     DELETE '/api/v1/theatres/:id
// @access    Private
exports.deleteTheatre = asyncHandler(async (req, res, next) => {

    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
        return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
    }

    // Allow remove only for Theatre publisher
    if (theatre.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to Delete this movie`, 401));
    }

    // It will trigger cascade delete movies
    theatre.remove();

    res.status(200).send({
        success: true,
        data: `Deleted theatre details with id ${req.params.id}`
    })
})


// @desc      Updare Image for Theatre
// @route     PUT '/api/v1/theatres/:id/photo
// @access    Private
exports.uploadTheatreImage = asyncHandler(async (req, res, next) => {

    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
        return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
    }
    // Allow remove only for Theatre publisher
    if (theatre.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with id ${req.user.id} not authroized to update image`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse('File not found', 400));
    }

    const file = req.files.file;


    /* Only Image type
    =========================== */
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Image File not found', 400));
    }

    /* File size validation
   =========================== */
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`File size exceeds the limit. Max limit ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    /* Generating unique file name
   =========================== */
    file.name = `photo${theatre._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(
                new ErrorResponse('Issue with image upload', 500)
            )
        }
        await Theatre.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name
        })
    })

})


/*
find : /api/v1/theatres?averageTicketCost[gte]=200&phone=94565857496
select: /api/v1/theatres?select=name,description
select & sort : /api/v1/theatres?select=name,description&sort=-name
*/