const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and exclude the password field
        req.user = await User.findById(decoded.user.id).select('-password');

        // Continue to the next middleware/route handler
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
