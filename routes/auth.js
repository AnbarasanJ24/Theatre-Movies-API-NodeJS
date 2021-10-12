const express = require('express');
const { register, login, getMe, forgotPassword } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotPassword);
router.route('/me').get(protect, authorize('admin', 'publisher'), getMe);

module.exports = router;