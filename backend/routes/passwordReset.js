const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const emailService = require('../services/emailService');
const recaptchaService = require('../services/recaptchaService');
const { passwordResetLimiter } = require('../middleware/rateLimiter');

// Request password reset
router.post('/request', passwordResetLimiter, async (req, res) => {
    try {
        const { email, recaptchaToken } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA verification is required' });
        }

        // Verify reCAPTCHA
        const recaptchaResult = await recaptchaService.verify(recaptchaToken, req.ip);
        
        if (!recaptchaResult.success) {
            return res.status(400).json({
                error: 'reCAPTCHA verification failed',
                details: recaptchaResult.errors
            });
        }

        // Find user
        const user = await User.findByEmail(email);

        // Generic response to prevent user enumeration
        const genericResponse = {
            message: 'If an account exists with this email, a password reset link has been sent.'
        };

        if (!user) {
            // Still return success to prevent user enumeration
            // Add configurable delay to prevent timing attacks (default 1 second)
            const delay = parseInt(process.env.TIMING_DELAY) || 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return res.json(genericResponse);
        }

        // Create reset token
        const resetToken = await PasswordReset.create(email);

        // Send email
        try {
            await emailService.sendPasswordResetEmail(
                user.email,
                resetToken.token,
                user.username
            );
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Don't expose email sending failure to user for security
        }

        res.json(genericResponse);
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
});

// Verify reset token
router.post('/verify-token', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const resetToken = await PasswordReset.findValidToken(token);

        if (!resetToken) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        // Get user email (without exposing full user data)
        const user = await User.findByEmail(resetToken.email);
        
        res.json({
            valid: true,
            email: user ? user.email : null
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Failed to verify token' });
    }
});

// Reset password
router.post('/reset', passwordResetLimiter, async (req, res) => {
    try {
        const { token, newPassword, recaptchaToken } = req.body;

        // Validate input
        if (!token || !newPassword) {
            return res.status(400).json({
                error: 'Token and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Password must be at least 6 characters long'
            });
        }

        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA verification is required' });
        }

        // Verify reCAPTCHA
        const recaptchaResult = await recaptchaService.verify(recaptchaToken, req.ip);
        
        if (!recaptchaResult.success) {
            return res.status(400).json({
                error: 'reCAPTCHA verification failed',
                details: recaptchaResult.errors
            });
        }

        // Verify token
        const resetToken = await PasswordReset.findValidToken(token);

        if (!resetToken) {
            return res.status(400).json({
                error: 'Invalid or expired reset token'
            });
        }

        // Update password
        await User.update(resetToken.email, { password: newPassword });

        // Mark token as used
        await PasswordReset.markAsUsed(token);

        res.json({
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
