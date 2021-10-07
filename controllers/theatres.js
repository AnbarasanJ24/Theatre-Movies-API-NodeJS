
const Theatre = require("../models/Theatre");
const ErrorResponse = require("../utilis/ErrorResponse");


// @desc      Get All Theatres
// @route     GET '/api/v1/theatres'
// @access    Public
exports.getTheatres = async (req, res, next) => {

    try {
        const data = await Theatre.find();

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (err) {
        next(error);

    }

}

// @desc      Get Single Theatre
// @route     GET '/api/v1/theatres/:id
// @access    Private
exports.getTheatre = async (req, res, next) => {

    try {
        const theatre = await Theatre.findById(req.params.id);
        if (!theatre) {
            return next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: theatre
        })

    } catch (error) {
        next(new ErrorResponse(`Theatre not found with id ${req.params.id}`, 404));

    }

}

// @desc      POST new Theatre
// @route     POST '/api/v1/theatres'
// @access    Private
exports.postTheatre = async (req, res, next) => {
    try {
        const body = await Theatre.create(req.body);
        res.status(201).json({
            success: true,
            data: body
        })
    } catch (error) {
        next(error);
    }

}

// @desc      Update Single Theatre
// @route     PUT '/api/v1/theatres/:id
// @access    Private
exports.updateTheatre = (req, res, next) => {
    res.status(200).send({ success: true, data: `Update Theatre details with id ${req.params.id}` })
}

// @desc      Delete Single Theatre
// @route     DELETE '/api/v1/theatres/:id
// @access    Private
exports.deleteTheatre = (req, res, next) => {
    res.status(200).send({ success: true, data: `Deleted theatre details with id ${req.params.id}` })
}
