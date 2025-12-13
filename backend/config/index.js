// Configuration module for backend
require('dotenv').config();

const config = {
    // Server
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Email
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || 'noreply@rnbwrolls.com'
    },
    
    // reCAPTCHA
    recaptcha: {
        siteKey: process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
        secretKey: process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
    },
    
    // Security
    security: {
        jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
        bcryptRounds: (() => {
            const rounds = parseInt(process.env.BCRYPT_ROUNDS);
            return (!isNaN(rounds) && rounds >= 10 && rounds <= 15) ? rounds : 10;
        })()
    },
    
    // Password Reset
    passwordReset: {
        tokenExpiry: (() => {
            const expiry = parseInt(process.env.RESET_TOKEN_EXPIRY);
            // Max 24 hours (86400000 ms), default 1 hour (3600000 ms)
            return (!isNaN(expiry) && expiry > 0 && expiry <= 86400000) ? expiry : 3600000;
        })(),
        timingDelay: parseInt(process.env.TIMING_DELAY) || 1000
    },
    
    // Frontend
    frontend: {
        url: process.env.FRONTEND_URL || (() => {
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            return `${protocol}://localhost:${parseInt(process.env.PORT) || 3000}`;
        })()
    }
};

// Validation warnings
if (config.nodeEnv === 'production') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('⚠️  WARNING: Email credentials not configured for production');
    }
    if (config.recaptcha.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
        console.warn('⚠️  WARNING: Using test reCAPTCHA keys in production');
    }
    if (config.security.jwtSecret === 'dev-secret-change-in-production') {
        console.warn('⚠️  WARNING: Using default JWT secret in production');
    }
}

module.exports = config;
