const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role,
        });

        await user.save();

        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
