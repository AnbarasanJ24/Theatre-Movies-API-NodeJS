const express = require('express');
const router = express.Router();


const Theatre = require('../models/Theatre');
const { getTheatres, postTheatre, getTheatre, updateTheatre, deleteTheatre, uploadTheatreImage } = require('../controllers/theatres');


/* Middleware for Filter, sorting, pagination
=========================== */
const advancedResults = require('../middleware/advancedResults');


/* Protect & Authorize User
=========================== */
const { protect, authorize } = require('../middleware/auth');

/* Other Resource Router
=========================== */
const moviesRouter = require('./movies');
const reviewRouter = require('./reviews');

/* Re-route into other resource routers
=========================== */
router.use('/:theatreId/movies', moviesRouter);
router.use('/:theatreId/reviews', reviewRouter)


/* File upload router
=========================== */
router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), uploadTheatreImage);

router
    .route('/')
    .get(advancedResults(Theatre, 'movies'), getTheatres)
    .post(protect, authorize('admin', 'publisher'), postTheatre);

router
    .route('/:id')
    .get(getTheatre)
    .put(protect, authorize('admin', 'publisher'), updateTheatre)
    .delete(protect, authorize('admin', 'publisher'), deleteTheatre);



module.exports = router;