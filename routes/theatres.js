const express = require('express');
const { getTheatres, postTheatre, getTheatre, updateTheatre, deleteTheatre } = require('../controllers/theatres');
const router = express.Router();

/* Other Resource Router
=========================== */
const moviesRouter = require('./movies');

/* Re-route into other resource routers
=========================== */
router.use('/:theatreId/movies', moviesRouter);


router
    .route('/')
    .get(getTheatres)
    .post(postTheatre);

router
    .route('/:id')
    .get(getTheatre)
    .put(updateTheatre)
    .delete(deleteTheatre);



module.exports = router;