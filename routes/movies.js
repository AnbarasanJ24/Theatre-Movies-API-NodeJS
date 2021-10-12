const express = require('express');
const router = express.Router({ mergeParams: true });
const Movies = require('../models/Movies');
const advancedResults = require('../middleware/advancedResults');

const { getMovie, getMovies, postMovie, updateMovie, deleteMovie } = require('../controllers/movies');
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