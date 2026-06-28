# Adesina Oke & Associates — Law Firm Website

Full-stack MERN application for Adesina Oke & Associates.

---

## Stack

- **MongoDB** — database (Atlas free tier recommended)
- **Express + Node.js** — REST API
- **React + Vite** — frontend
- **Resend** — email notifications
- **Termii** — SMS notifications (Nigerian gateway)

---

## Project Structure

```
adesina-oke/
├── server/
│   ├── config/         # DB connection, notifications
│   ├── middleware/      # JWT auth
│   ├── models/          # Meeting, Journal, User
│   ├── routes/          # auth, meetings, journal
│   ├── scripts/         # seed.js (run once)
│   └── index.js
├── client/
│   └── src/
│       ├── pages/       # Home, About, Founder, Journal, Schedule, AdminLogin
│       ├── components/  # Navbar, Footer
│       ├── admin/       # Dashboard, MeetingsTab, JournalTab
│       ├── context/     # AuthContext (JWT)
│       └── api.js       # Axios instance
└── package.json         # root — runs both together
```

---

## Setup (Step by Step)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | https://cloud.mongodb.com → free cluster → Connect |
| `JWT_SECRET` | Any long random string (https://generate-secret.vercel.app/64) |
| `ADMIN_EMAIL` | Your chosen admin login email |
| `ADMIN_PASSWORD` | Your chosen admin password (min 8 chars) |
| `RESEND_API_KEY` | https://resend.com → API Keys |
| `EMAIL_FROM` | A verified sender email on Resend |
| `FIRM_EMAIL` | The firm's email (receives booking alerts) |
| `TERMII_API_KEY` | https://termii.com → Settings → API |
| `TERMII_SENDER_ID` | Your approved Termii sender name |
| `FIRM_PHONE` | The firm's Nigerian phone number (+234...) |

### 3. Seed the database

Creates the admin user and a sample journal entry.

```bash
cd server
npm run seed
```

You'll see your login credentials printed in the terminal.

### 4. Run the app

From the project root:

```bash
npm run dev
```

This starts:
- **Server** on http://localhost:5000
- **Client** on http://localhost:5173

Open http://localhost:5173 in your browser.

---

## Admin Dashboard

Go to http://localhost:5173/admin/login (or click "Admin Access" in the footer).

Log in with the credentials you set in `.env`.

**Meetings tab** — view all consultation requests, confirm or cancel them (client gets email + SMS on each action).

**Journal tab** — create and edit entries, view full version history, revert to any previous version.

---

## Deployment

### Server
Deploy to **Railway**, **Render**, or any Node.js host.
- Set all environment variables from `.env` in the hosting dashboard
- Change `NODE_ENV=production` and update `CLIENT_URL` to your live domain

### Client
```bash
cd client
npm run build
```
Deploy the `client/dist/` folder to **Vercel** or **Netlify**.
- Set the API proxy or update `api.js` baseURL to your live server URL

---

## API Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Admin | Verify token |
| POST | `/api/meetings` | Public | Book a meeting |
| GET | `/api/meetings` | Admin | List all meetings |
| GET | `/api/meetings/slots?date=` | Public | Available time slots |
| PATCH | `/api/meetings/:id` | Admin | Confirm / cancel |
| DELETE | `/api/meetings/:id` | Admin | Delete record |
| GET | `/api/journal` | Public | List all entries |
| GET | `/api/journal/:id` | Public | Single entry |
| POST | `/api/journal` | Admin | Create entry |
| PUT | `/api/journal/:id` | Admin | Edit entry (saves version) |
| POST | `/api/journal/:id/revert` | Admin | Revert to previous version |
| GET | `/api/journal/:id/versions` | Admin | View version history |
| DELETE | `/api/journal/:id` | Admin | Delete entry |
