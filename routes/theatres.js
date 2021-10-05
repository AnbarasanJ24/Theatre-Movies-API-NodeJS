const express = require('express');
const { getTheatres, postTheatre, getTheatre, updateTheatre, deleteTheatre } = require('../controllers/theatres');
const router = express.Router();

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