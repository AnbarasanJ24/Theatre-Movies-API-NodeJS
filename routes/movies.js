const express = require('express');
const router = express.Router({ mergeParams: true });
const Movies = require('../models/Movies');
const advancedResults = require('../middleware/advancedResults');

const { getMovie, getMovies, postMovie, updateMovie, deleteMovie } = require('../controllers/movies');

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