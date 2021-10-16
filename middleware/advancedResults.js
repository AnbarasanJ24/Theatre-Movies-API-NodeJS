/* Middleware to handle Filter, Pagination, projection 
=========================== */
const advancedResults = (modal, populate) => async (req, res, next) => {

    // Taking copy to avoid passing unnecessary field to find query
    let reqQuery = { ...req.query };


    // Removing fields in copied req.query
    let removeFields = ['select', 'sort', 'page', 'limit', 'skip'];
    removeFields.forEach(params => delete reqQuery[params]);



    // Making comparison operator query
    let query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(eq|neq|gt|gte|lt|lte)\b/g, match => `$${match}`);

    query = modal.find(JSON.parse(queryStr));




    // select query (Need to send required fields for display)
    if (req.query.select) {
        const selectQuery = req.query.select.split(',').join(' ');
        query = query.select(selectQuery);
    }



    // Populate Values
    if (populate) {
        query = query.populate(populate);
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
    const limit = parseInt(req.query.limit, 10) || 10;

    // No of Documents to be skipped
    // For second page=> (2-1)*10 = 10 (So 10 documents will be skipped)
    // startIndex =10 and endIndex=20
    // Assume we have total 40 records
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await modal.countDocuments();

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

    res.advancedResults = {
        success: true,
        count: total,
        pagination,
        data
    }
    next();
}

module.exports = advancedResults;