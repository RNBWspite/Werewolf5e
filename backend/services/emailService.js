const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initTransporter();
    }

    initTransporter() {
        // Create reusable transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendPasswordResetEmail(email, token, username) {
        // Use HTTPS by default for security, fallback to HTTP only in development
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const defaultUrl = `${protocol}://localhost:3000`;
        const resetUrl = `${process.env.FRONTEND_URL || defaultUrl}/reset-password.html?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Request - Werewolf 5E',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #6B8E23 0%, #556B2F 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background-color: #6B8E23;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                        .button:hover {
                            background-color: #556B2F;
                        }
                        .footer {
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                            background-color: #f9f9f9;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🐺 Werewolf 5E</h1>
                            <p>Password Reset Request</p>
                        </div>
                        <div class="content">
                            <p>Hello ${username || 'User'},</p>
                            
                            <p>We received a request to reset your password for your Werewolf 5E account. Click the button below to reset your password:</p>
                            
                            <center>
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </center>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #6B8E23;">${resetUrl}</p>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
                            </div>
                            
                            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                            
                            <p>For security reasons, never share this link with anyone.</p>
                            
                            <p>Best regards,<br>The RNBW Rolls Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                            <p>© ${new Date().getFullYear()} RNBW Rolls. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Hello ${username || 'User'},

We received a request to reset your password for your Werewolf 5E account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
The RNBW Rolls Team
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    // Test email configuration
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Email server connection verified');
            return true;
        } catch (error) {
            console.error('Email server connection failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
