const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const TOKENS_FILE = path.join(__dirname, '../data/reset-tokens.json');

class PasswordReset {
    constructor(data) {
        this.email = data.email;
        this.token = data.token;
        this.createdAt = data.createdAt || Date.now();
        // Validate token expiry with safe fallback (default 1 hour)
        const expiry = parseInt(process.env.RESET_TOKEN_EXPIRY);
        const tokenExpiry = (!isNaN(expiry) && expiry > 0 && expiry <= 86400000) ? expiry : 3600000;
        this.expiresAt = data.expiresAt || Date.now() + tokenExpiry;
        this.used = data.used || false;
    }

    // Read all tokens from file
    static async readTokens() {
        try {
            const data = await fs.readFile(TOKENS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    // Write tokens to file
    static async writeTokens(tokens) {
        await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    }

    // Generate reset token
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Create new reset token
    static async create(email) {
        const tokens = await PasswordReset.readTokens();
        
        // Invalidate any existing tokens for this email
        const updatedTokens = tokens.map(t => 
            t.email === email.toLowerCase() ? { ...t, used: true } : t
        );

        const token = PasswordReset.generateToken();
        const resetToken = new PasswordReset({
            email: email.toLowerCase(),
            token
        });

        updatedTokens.push(resetToken);
        await PasswordReset.writeTokens(updatedTokens);

        return resetToken;
    }

    // Find valid token
    static async findValidToken(token) {
        const tokens = await PasswordReset.readTokens();
        const now = Date.now();

        const tokenData = tokens.find(t => 
            t.token === token && 
            !t.used && 
            t.expiresAt > now
        );

        return tokenData ? new PasswordReset(tokenData) : null;
    }

    // Mark token as used
    static async markAsUsed(token) {
        const tokens = await PasswordReset.readTokens();
        const updatedTokens = tokens.map(t =>
            t.token === token ? { ...t, used: true } : t
        );
        await PasswordReset.writeTokens(updatedTokens);
    }

    // Clean up expired tokens (can be called periodically)
    static async cleanupExpired() {
        const tokens = await PasswordReset.readTokens();
        const now = Date.now();
        const validTokens = tokens.filter(t => t.expiresAt > now);
        await PasswordReset.writeTokens(validTokens);
    }

    // Check if token is valid
    isValid() {
        return !this.used && this.expiresAt > Date.now();
    }
}

module.exports = PasswordReset;
