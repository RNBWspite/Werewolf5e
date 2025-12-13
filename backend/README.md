# Werewolf 5E Backend

Backend server for Werewolf 5E application with email-based password reset and reCAPTCHA integration.

## Features

- User registration with bcrypt password hashing
- User authentication (login/logout)
- Email-based password reset with reCAPTCHA protection
- Token-based password reset links with expiration
- RESTful API design
- File-based data storage (JSON)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Email**: Nodemailer
- **Security**: bcrypt for password hashing, Google reCAPTCHA v2
- **Storage**: File-based JSON storage (easily replaceable with database)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Required environment variables:

- `EMAIL_HOST`: SMTP server hostname (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP port (usually 587 for TLS)
- `EMAIL_USER`: Your email address
- `EMAIL_PASSWORD`: Your email password or app-specific password
- `RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key

### 3. Set Up Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2 ("I'm not a robot" checkbox)
3. Add your domain (localhost for development)
4. Copy the Site Key and Secret Key to `.env`

### 4. Set Up Email (Gmail Example)

For Gmail:
1. Enable 2-factor authentication
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `EMAIL_PASSWORD`

### 5. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "dob": "YYYY-MM-DD",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "username": "...",
    "email": "...",
    "createdAt": "..."
  }
}
```

#### POST /api/auth/login
Authenticate a user.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "username": "...",
    "email": "...",
    "createdAt": "..."
  }
}
```

### Password Reset

#### POST /api/password-reset/request
Request a password reset email.

**Request:**
```json
{
  "email": "string",
  "recaptchaToken": "string"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

#### POST /api/password-reset/verify-token
Verify if a reset token is valid.

**Request:**
```json
{
  "token": "string"
}
```

**Response:**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

#### POST /api/password-reset/reset
Reset password using a valid token.

**Request:**
```json
{
  "token": "string",
  "newPassword": "string",
  "recaptchaToken": "string"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

## Data Storage

The backend uses JSON files for data storage:

- `backend/data/users.json` - User accounts
- `backend/data/reset-tokens.json` - Password reset tokens

**Note**: For production, replace with a proper database (MongoDB, PostgreSQL, etc.)

## Security Features

1. **Password Hashing**: Uses bcrypt with configurable rounds
2. **reCAPTCHA**: Prevents automated abuse of password reset
3. **Token Expiration**: Reset tokens expire after 1 hour
4. **Generic Error Messages**: Prevents user enumeration attacks
5. **Rate Limiting**: Consider adding rate limiting middleware for production

## Production Deployment

### Recommended Improvements

1. **Database**: Replace JSON storage with proper database
2. **Rate Limiting**: Add express-rate-limit middleware
3. **HTTPS**: Ensure all traffic uses HTTPS
4. **Email Queue**: Use email queue (Bull, BeeQueue) for reliability
5. **Monitoring**: Add logging and monitoring (Winston, Morgan)
6. **Environment**: Use production-grade email service (SendGrid, AWS SES)

### Environment Variables for Production

Update `.env` with production values:
- Use strong JWT_SECRET
- Configure production email service
- Use production reCAPTCHA keys
- Set NODE_ENV=production

## Testing

### Manual Testing

1. Register a new user
2. Login with credentials
3. Request password reset
4. Check email for reset link
5. Click link and reset password
6. Login with new password

### Test reCAPTCHA Keys

For testing, Google provides test keys that always pass:

- Site key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These are included in `.env` by default.

## Troubleshooting

### Email not sending

- Check SMTP credentials
- Verify email port and security settings
- Check spam folder
- Test with a simple SMTP tester

### reCAPTCHA failing

- Verify site key matches domain
- Check browser console for errors
- Ensure reCAPTCHA script is loaded

### Server not starting

- Check port 3000 is not in use
- Verify all dependencies are installed
- Check `.env` file exists and is properly formatted

## License

ISC
