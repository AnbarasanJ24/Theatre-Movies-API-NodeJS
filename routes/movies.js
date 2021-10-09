const express = require('express');
const { getMovie, getMovies } = require('../controllers/movies');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getMovies)
// .post()

router
    .route('/:id')
    .get(getMovie)
//     .put()
//     .delete()


module.exports = router;