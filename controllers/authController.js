const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const { hashOtp } = require('../services/hash-services');
const sendOtp = require('../utils/sendOtp');
const { verifyOtp } = require('../services/otp-services');

exports.register = async (req, res) => {
    try {
        const { name, number, email, password, role } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Create a new user instance
        user = new User({
            name,
            number,
            email,
            password,
            role,
        });

        // Save the user to the database
        await user.save();

        // Create the JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign the token using the secret from .env file
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookies for token and refresh token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send success response
        res.status(201).json({ msg: 'Registration successful' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Await the user query
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Create the JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign the token using the secret from .env file
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookies for token and refresh token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send success response
        res.status(200).json({ msg: 'Login successful' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.sendOTP = async (req, res) => {

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'email field is required!' });
    }

    // Await the user query
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    const otp = await crypto.randomInt(1000, 9999);

    const ttl = 1000 * 60 * 2; // 2 min
    const expires = Date.now() + ttl;

    const data = `${otp}.${expires}`;
    const hash = hashOtp(data);

    // send OTP
    try {
        // await sendOtp(email, otp);
        return res.json({
            hash: `${hash}.${expires}`,
            email,
            otp, // Remove this in production for security reasons
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Message sending failed' });
    }

}

exports.verifyOtp = async (req, res) => {
    const { otp, hash, email } = req.body;
    if (!otp || !hash || !email) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const [hashedOtp, expires] = hash.split('.');
    if (Date.now() > +expires) {
        return res.status(400).json({ message: 'OTP expired!' });
    }

    const data = `${otp}.${expires}`;

    const isValid = verifyOtp(hashedOtp, data);

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    await User.findOneAndUpdate({ email }, { isActivated: true });

    res.status(200).json({ msg: "User Authenticated succefully" });
}