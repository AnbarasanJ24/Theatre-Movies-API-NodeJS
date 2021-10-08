
const asyncHandler = require("../middleware/async");
const Theatre = require("../models/Theatre");
const ErrorResponse = require("../utilis/ErrorResponse");


// @desc      Get All Theatres
// @route     GET '/api/v1/theatres'
// @access    Public
exports.getTheatres = asyncHandler(async (req, res, next) => {
    console.log(req.query)

    // Taking copy to avoid passing unnecessary field to find query
    let reqQuery = { ...req.query };

    // Removing fields in copied req.query
    let removeFields = ['select', 'sort', 'page', 'limit', 'skip'];
    removeFields.forEach(params => delete reqQuery[params]);

    // Making comparison operator query
    let query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(eq|neq|gt|gte|lt|lte)\b/g, match => `$${match}`)
    query = Theatre.find(JSON.parse(queryStr));

    // select query (Need to send required fields for display)
    if (req.query.select) {
        const selectQuery = req.query.select.split(',').join(' ');
        query = query.select(selectQuery);
    }

    // sorting (value -> 1(Ascending) & -1 descending)
    // ascending sort=name and descending = -name
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination & Limit
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    // No of Documents to be skipped
    // For second page=> (2-1)*10 = 10 (So 10 documents will be skipped)
    // startIndex =10 and endIndex=20
    // Assume we have total 40 records
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Theatre.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const data = await query;

    // Creating pagination object
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        data: data,
        count: total,
        pagination
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


/*
find : /api/v1/theatres?averageTicketCost[gte]=200&phone=94565857496
select: /api/v1/theatres?select=name,description
select & sort : /api/v1/theatres?select=name,description&sort=-name
*/