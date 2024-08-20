const express = require('express');
const { register, login, sendOTP, verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sendOtp', sendOTP);
router.post('/verifyOtp', verifyOtp);

module.exports = router;