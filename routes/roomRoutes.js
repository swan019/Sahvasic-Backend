const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { addRoom, getRooms } = require('../controllers/roomController');

router.post('/addRoom', authMiddleware, uploadMiddleware, addRoom);
router.get('/getRooms', authMiddleware, getRooms);

module.exports = router;