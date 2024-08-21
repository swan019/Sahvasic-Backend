const express = require('express');
const { removeUser, removeRoom } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.delete('/user/:id', authMiddleware, adminMiddleware, removeUser);
router.delete('/room/:id', authMiddleware, adminMiddleware, removeRoom);


module.exports = router;