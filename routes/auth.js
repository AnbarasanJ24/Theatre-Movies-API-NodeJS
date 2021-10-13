const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/me').get(protect, authorize('admin', 'publisher'), getMe);
router.route('/resetPassword/:resetToken').put(resetPassword);
router.route('/updateDetails').put(protect, updateDetails);
router.route('/updatePassword').put(protect, updatePassword);

module.exports = router;