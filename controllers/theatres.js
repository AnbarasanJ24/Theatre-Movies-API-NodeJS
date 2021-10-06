
// @desc      Get All Theatres
// @route     GET '/api/v1/theatres'

const Theatre = require("../models/Theatre");

// @access    Public
exports.getTheatres = (req, res, next) => {
    res.status(200).send({ success: true, data: 'Displaying all theatres' });
}

// @desc      Get Single Theatre
// @route     GET '/api/v1/theatres/:id
// @access    Private
exports.getTheatre = (req, res, next) => {
    res.status(200).send({ success: true, data: 'Display single theatre' });
}

// @desc      POST new Theatre
// @route     POST '/api/v1/theatres'
// @access    Private
exports.postTheatre = async (req, res, next) => {
    const body = await Theatre.create(req.body);
    // console.log(req.body);
    res.status(201).json({ success: true, data: body })
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
