const axios = require('axios');

class RecaptchaService {
    async verify(token, remoteIp = null) {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        if (!secretKey) {
            console.warn('RECAPTCHA_SECRET_KEY not configured. Skipping verification in development.');
            return { success: true, score: 1.0 };
        }

        try {
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
                params: {
                    secret: secretKey,
                    response: token,
                    remoteip: remoteIp
                }
            });

            const data = response.data;

            if (!data.success) {
                console.error('reCAPTCHA verification failed:', data['error-codes']);
                return {
                    success: false,
                    errors: data['error-codes'] || ['verification-failed']
                };
            }

            return {
                success: true,
                score: data.score || null,
                action: data.action || null,
                challengeTs: data.challenge_ts,
                hostname: data.hostname
            };
        } catch (error) {
            console.error('Error verifying reCAPTCHA:', error);
            throw new Error('Failed to verify reCAPTCHA');
        }
    }

    // For development/testing - bypass reCAPTCHA
    async verifyTestToken(token) {
        // Google's test keys that always pass
        const testSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
        const testSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

        if (process.env.RECAPTCHA_SECRET_KEY === testSecretKey) {
            return { success: true, score: 1.0, test: true };
        }

        return this.verify(token);
    }
}

module.exports = new RecaptchaService();
