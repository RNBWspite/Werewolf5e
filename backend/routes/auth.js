const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, dob, password } = req.body;

        // Validation
        if (!username || !email || !dob || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['username', 'email', 'dob', 'password']
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            dob,
            password
        });

        res.status(201).json({
            message: 'User created successfully',
            user: user.toSafeObject()
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const isValidPassword = await user.verifyPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        res.json({
            message: 'Login successful',
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = router;
