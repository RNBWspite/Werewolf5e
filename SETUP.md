# Backend Setup Guide

This guide will help you set up the backend server for email-based password reset with reCAPTCHA.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A Gmail account (or other SMTP email service)
- Google account for reCAPTCHA

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express - Web server framework
- nodemailer - Email sending
- bcrypt - Password hashing
- cors - Cross-origin resource sharing
- dotenv - Environment variable management
- axios - HTTP client for reCAPTCHA verification

### 2. Configure Environment Variables

The `.env` file is already configured with test values. For production, update it with your real credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com          # Update this
EMAIL_PASSWORD=your-app-password         # Update this
EMAIL_FROM=noreply@rnbwrolls.com

# Google reCAPTCHA
RECAPTCHA_SITE_KEY=your-site-key         # Update for production
RECAPTCHA_SECRET_KEY=your-secret-key     # Update for production

# Security
JWT_SECRET=your-jwt-secret-key           # Update for production
BCRYPT_ROUNDS=10

# Password Reset
RESET_TOKEN_EXPIRY=3600000               # 1 hour in milliseconds
```

### 3. Set Up Gmail for Email Sending

#### Option A: Gmail App Password (Recommended)

1. Go to your [Google Account](https://myaccount.google.com/)
2. Click on "Security"
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords" (search for it if you can't find it)
5. Select "Mail" and your device
6. Click "Generate"
7. Copy the 16-character password
8. Update `.env`:
   ```env
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

#### Option B: Gmail "Less Secure Apps" (Not Recommended)

1. Go to [Less secure app access](https://myaccount.google.com/lesssecureapps)
2. Turn on "Allow less secure apps"
3. Use your regular Gmail password in `.env`

**Note**: Option A is much more secure.

### 4. Set Up Google reCAPTCHA

#### For Development (Using Test Keys)

The `.env` file already includes Google's test keys that always pass validation:

```env
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

These keys work on localhost and always succeed.

#### For Production

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Fill in the form:
   - **Label**: Werewolf 5E
   - **reCAPTCHA type**: reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - **Domains**: Add your domain (e.g., rnbwrolls.com)
   - Accept the terms
3. Click "Submit"
4. Copy your Site Key and Secret Key
5. Update `.env`:
   ```env
   RECAPTCHA_SITE_KEY=your_actual_site_key
   RECAPTCHA_SECRET_KEY=your_actual_secret_key
   ```
6. Update `account.html` and `reset-password.html` to use your site key:
   ```html
   <div class="g-recaptcha" data-sitekey="your_actual_site_key"></div>
   ```

### 5. Start the Server

```bash
npm start
```

You should see:
```
Server is running on port 3000
Frontend: http://localhost:3000
API: http://localhost:3000/api
```

Visit http://localhost:3000 to access the application.

## Testing the Password Reset Flow

### 1. Create a Test Account

1. Go to http://localhost:3000/account.html
2. Click "Create one" to sign up
3. Fill in the form and create an account

### 2. Test Password Reset

1. Click "Sign Out"
2. Click "Forgot Password?"
3. Enter your email address
4. Complete the reCAPTCHA
5. Click "Send Reset Link"
6. Check your email for the password reset link
7. Click the link in the email
8. Enter a new password
9. Complete the reCAPTCHA
10. Click "Reset Password"
11. Sign in with your new password

## Troubleshooting

### Email Not Sending

**Problem**: Password reset emails are not being received.

**Solutions**:
1. Check spam/junk folder
2. Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
3. Ensure 2-factor authentication is enabled on Gmail
4. Verify you're using an App Password, not your regular password
5. Check server logs for email errors
6. Try sending a test email:
   ```javascript
   // In Node.js console
   const emailService = require('./backend/services/emailService');
   emailService.verifyConnection();
   ```

### reCAPTCHA Not Working

**Problem**: reCAPTCHA verification fails.

**Solutions**:
1. Verify RECAPTCHA_SITE_KEY matches in both `.env` and HTML files
2. Check browser console for JavaScript errors
3. Ensure reCAPTCHA script is loaded: `<script src="https://www.google.com/recaptcha/api.js" async defer></script>`
4. For production, verify your domain is registered in reCAPTCHA admin console
5. Clear browser cache and reload

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
1. Change PORT in `.env` to a different number (e.g., 3001)
2. Or kill the process using port 3000:
   ```bash
   # On Linux/Mac
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### Cannot Find Module

**Problem**: `Error: Cannot find module 'express'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

## API Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "dob": "1990-01-01",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Request Password Reset

```bash
curl -X POST http://localhost:3000/api/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "recaptchaToken": "test-token"
  }'
```

## Production Deployment

### Prerequisites

1. **Database**: Replace JSON file storage with MongoDB, PostgreSQL, or MySQL
2. **Email Service**: Use SendGrid, AWS SES, or similar instead of Gmail
3. **Environment**: Set NODE_ENV=production
4. **HTTPS**: Deploy behind HTTPS (required for reCAPTCHA in production)
5. **Domain**: Update reCAPTCHA keys with your production domain

### Deployment Platforms

#### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create werewolf5e

# Set environment variables
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set RECAPTCHA_SITE_KEY=your-site-key
heroku config:set RECAPTCHA_SECRET_KEY=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### DigitalOcean / VPS

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone https://github.com/RNBWspite/Werewolf5e.git
cd Werewolf5e

# Install dependencies
npm install

# Set up environment variables
nano .env  # Edit with your values

# Install PM2 for process management
npm install -g pm2

# Start the server
pm2 start server.js --name werewolf5e

# Set up PM2 to start on boot
pm2 startup
pm2 save
```

## Security Checklist

- [ ] Changed default JWT_SECRET
- [ ] Using App Password for Gmail (not regular password)
- [ ] Using production reCAPTCHA keys (not test keys)
- [ ] HTTPS enabled
- [ ] Strong passwords required (enforced)
- [ ] Rate limiting added
- [ ] Email service configured correctly
- [ ] Environment variables secured (not in git)
- [ ] NODE_ENV set to production
- [ ] Database backups configured

## Support

For issues or questions:
- Check `backend/README.md` for API documentation
- Review server logs for error messages
- Contact: support@rnbwrolls.com

## Next Steps

1. **Add Database**: Replace JSON storage with a proper database
2. **Add Rate Limiting**: Prevent abuse with express-rate-limit
3. **Add Logging**: Implement Winston or similar for production logs
4. **Add Monitoring**: Set up error tracking (Sentry, Bugsnag)
5. **Add Tests**: Write unit and integration tests
6. **Add Email Queue**: Use Bull or BeeQueue for reliable email delivery
7. **Add Session Management**: Implement JWT tokens or sessions
8. **Add Admin Panel**: Create admin interface for user management
