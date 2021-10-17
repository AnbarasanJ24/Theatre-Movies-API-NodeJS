const express = require('express');
const router = express.Router({ mergeParams: true });

const { getMovie, getMovies, postMovie, updateMovie, deleteMovie } = require('../controllers/movies');
const Movies = require('../models/Movies');

/* Middleware for Filter, sorting, pagination
=========================== */
const advancedResults = require('../middleware/advancedResults');


/* Protect & Authorize User
=========================== */
const { protect, authorize } = require('../middleware/auth');


router
    .route('/')
    .get(advancedResults(
        Movies,
        {
            path: 'theatre',
            select: 'name description'
        }
    ), getMovies)
    .post(protect, authorize('admin', 'publisher'), postMovie);

router
    .route('/:id')
    .get(getMovie)
    .put(protect, authorize('admin', 'publisher'), updateMovie)
    .delete(protect, authorize('admin', 'publisher'), deleteMovie);


module.exports = router;