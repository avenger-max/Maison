// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const generateToken = (userId, email) => {
    return jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required.' });
        if (password.length < 6)
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });

        const existing = await UserModel.findByEmail(email);
        if (existing)
            return res.status(409).json({ message: 'Email is already registered.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await UserModel.create({ name, email, hashedPassword });
        const token = generateToken(userId, email);

        res.status(201).json({ message: 'Account created successfully.', token, user: { id: userId, name, email } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required.' });

        const user = await UserModel.findByEmail(email);
        if (!user)
            return res.status(401).json({ message: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid email or password.' });

        const token = generateToken(user.id, user.email);
        res.json({ message: 'Login successful.', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = { register, login };
