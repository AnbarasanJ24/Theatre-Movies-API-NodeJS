const express = require('express');
const { getMovie, getMovies, postMovie, updateMovie, deleteMovie } = require('../controllers/movies');
const advancedResults = require('../middleware/advancedResults');
const Movies = require('../models/Movies');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(
        Movies,
        {
            path: 'theatre',
            select: 'name description'
        }
    ), getMovies)
    .post(postMovie);

router
    .route('/:id')
    .get(getMovie)
    .put(updateMovie)
    .delete(deleteMovie);


module.exports = router;