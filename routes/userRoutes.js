const express = require('express');
const { getUserProfile, updateUserProfile, getMatchingRooms } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, uploadMiddleware,  updateUserProfile);
router.get('/getMatchingRooms', authMiddleware, getMatchingRooms);


module.exports = router;