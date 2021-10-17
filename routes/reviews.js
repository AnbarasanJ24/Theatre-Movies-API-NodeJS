const express = require('express');
const router = express.Router({ mergeParams: true });


const Review = require('../models/Review');
const { getReviews, getReview, createReview, updateReview, deleteReview } = require('../controllers/reviews');


/* Middleware for Filter, sorting, pagination
=========================== */
const advancedResults = require('../middleware/advancedResults');


/* Protect & Authorize User
=========================== */
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(advancedResults(Review, {
        path: 'theatre',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('admin', 'user'), createReview)

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect, authorize('admin', 'user'), deleteReview);


module.exports = router;