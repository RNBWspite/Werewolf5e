# Copilot Instructions for Werewolf 5E

## Project Overview

Werewolf 5E is a full-stack web application for a werewolf-themed tabletop RPG. It provides interactive character sheets for multiple game systems (Werewolf 5E, D&D 5E, Vampire: The Masquerade, Call of Cthulhu) along with user account management (registration, login, password reset).

## Technology Stack

**Backend:**
- Runtime: Node.js (v14+)
- Framework: Express.js
- Authentication: bcrypt (password hashing)
- Email: Nodemailer (SMTP / Gmail)
- Security: Google reCAPTCHA v2, express-rate-limit, CORS
- Configuration: dotenv
- HTTP client: axios
- Data storage: JSON files (easily replaceable with a database)

**Frontend:**
- Plain HTML5 pages (no build step required)
- CSS in `src/styles/styles.css`
- Vanilla JavaScript (no framework)

## Project Structure

```
/
├── server.js                    # Express app entry point
├── package.json
├── .env.example                 # Copy to .env and fill in credentials
├── backend/
│   ├── config/                  # App configuration (ports, secrets, etc.)
│   ├── data/                    # JSON storage: users.json, reset-tokens.json
│   ├── middleware/              # Express middleware (e.g., rateLimiter.js)
│   ├── models/                  # Data model helpers
│   ├── routes/                  # Express route handlers
│   │   ├── auth.js              # POST /api/auth/register, /api/auth/login
│   │   └── passwordReset.js     # POST /api/password-reset/*
│   └── services/                # Business logic (emailService, etc.)
├── src/styles/styles.css        # Global stylesheet
├── data/                        # Static game data (JSON)
├── index.html                   # Landing page
├── account.html                 # Login / register page
├── characters.html              # Character list
├── create-character.html        # Character creation wizard
├── character-sheet.html         # Werewolf 5E interactive sheet
├── dnd5e.html                   # D&D 5E sheet
├── vampire-masquerade.html      # Vampire: The Masquerade sheet
├── call-of-cthulhu.html         # Call of Cthulhu sheet
├── sessions.html                # Game session management
└── reset-password.html          # Password reset flow
```

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see below)
   ```

3. **Start the development server:**
   ```bash
   npm run dev     # sets NODE_ENV=development
   # or
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

### Key Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |
| `EMAIL_HOST` | SMTP host (e.g., smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (e.g., 587) |
| `EMAIL_USER` | Sender email address |
| `EMAIL_PASSWORD` | Email app password |
| `EMAIL_FROM` | From address in emails |
| `RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 site key |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v2 secret key |
| `JWT_SECRET` | Secret for signing tokens |
| `BCRYPT_ROUNDS` | bcrypt cost factor (default: 10) |
| `RESET_TOKEN_EXPIRY` | Token TTL in ms (default: 3600000 = 1 h) |

For local development Google provides test reCAPTCHA keys (already in `.env.example`) that always pass.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/config` | Returns public config (reCAPTCHA site key) |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `POST` | `/api/password-reset/request` | Send password-reset email |
| `POST` | `/api/password-reset/verify-token` | Validate a reset token |
| `POST` | `/api/password-reset/reset` | Reset password with token |

All other `GET` routes fall through to static file serving; the catch-all serves `404.html` for unknown paths.

## Code Conventions

- **JavaScript style:** CommonJS modules (`require` / `module.exports`). No transpilation step.
- **Error handling:** Use `next(err)` to forward errors to the Express error handler in `server.js`.
- **Security:** Never log or expose passwords, tokens, or secret keys. Always use generic error messages in password-reset flows to prevent user enumeration.
- **Environment secrets:** Never hardcode credentials. Always read from `process.env`.
- **Data storage:** User records live in `backend/data/users.json`; reset tokens in `backend/data/reset-tokens.json`. When modifying data models, keep these files in sync.
- **Frontend:** Keep pages self-contained HTML files. Shared styles go in `src/styles/styles.css`. Use vanilla JS — do not introduce a frontend framework.
- **No build step:** There is no bundler (Webpack, Vite, etc.). Changes to HTML/CSS/JS are effective immediately.

## Testing

There is currently no automated test suite. To validate changes manually:

1. Start the server with `npm run dev`.
2. Exercise the relevant page in the browser at `http://localhost:3000`.
3. For API changes, use `curl` or a tool like Postman against `http://localhost:3000/api/...`.
4. Check the server console for errors.

Example cURL calls are documented in `SETUP.md`.

## Additional Documentation

- `SETUP.md` — Detailed setup guide including Gmail and reCAPTCHA configuration.
- `backend/README.md` — Full API reference and deployment notes.
- `ATTRIBUTE_DISTRIBUTION.md` — Werewolf 5E attribute rules.
- `SKILLS_DISTRIBUTION.md` — Werewolf 5E skill rules.
- `SLIDESHOW_IMAGES.md` — Notes on background images used in the UI.
