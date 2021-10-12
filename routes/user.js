const express = require('express');
const { getUsers, createUser, getUser, updateeUser, deleteUser } = require('../controllers/user');
const router = express.Router();
const User = require('../models/User');


/* Middleware for Filter, sorting, pagination
=========================== */
const advancedResults = require('../middleware/advancedResults');


/* Protect & Authorize User
=========================== */
const { protect, authorize } = require('../middleware/auth');


/* Middleware apply all the routes
=========================== */
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateeUser)
    .delete(deleteUser);

module.exports = router;