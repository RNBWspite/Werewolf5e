const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Import routes and middleware
const { apiLimiter } = require('./backend/middleware/rateLimiter');
const authRoutes = require('./backend/routes/auth');
const passwordResetRoutes = require('./backend/routes/passwordReset');

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Get public configuration
app.get('/api/config', (req, res) => {
    const config = require('./backend/config');
    res.json({
        recaptchaSiteKey: config.recaptcha.siteKey
    });
});

// Catch-all route for serving HTML pages
app.get('*', (req, res) => {
    const requestedPath = req.path === '/' ? '/index.html' : req.path;
    const filePath = path.join(__dirname, requestedPath);
    res.sendFile(filePath, (err) => {
        if (err) {
            // Try to serve 404.html, or send a simple 404 response
            const notFoundPath = path.join(__dirname, '404.html');
            res.status(404).sendFile(notFoundPath, (err404) => {
                if (err404) {
                    res.status(404).send('<h1>404 - Page Not Found</h1>');
                }
            });
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
