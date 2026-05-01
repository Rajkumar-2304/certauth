# CertAuth — Academic Certificate Authenticator
## Smart India Hackathon 2025 · PS #SIH25029

> End-to-end cryptographic certificate validation platform built with React, Node.js, Express, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

## 📁 Project Structure

```
certauth/
├── backend/          # Node.js + Express API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── utils/        # Mailer utility
│   ├── uploads/      # Uploaded documents (auto-created)
│   ├── server.js     # Entry point
│   ├── .env          # Environment variables
│   └── package.json
│
└── frontend/         # React + TypeScript app
    ├── src/
    │   ├── pages/    # All page components
    │   ├── components/ # Navbar, Footer
    │   ├── context/  # AuthContext
    │   └── assets/   # Logo images
    └── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 — Backend Setup

```bash
cd backend
npm install
```

Edit `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certauth
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

Start backend:
```bash
npm run dev     # with nodemon (recommended)
# or
npm start       # production
```

Backend runs at: http://localhost:5000

---

### Step 2 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

---

## 🖥️ Run Both (Windows)

Open two terminal windows:

**Terminal 1 (Backend):**
```cmd
cd certauth\backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```cmd
cd certauth\frontend
npm install
npm start
```

---

## 🖥️ Run Both (Linux/Mac)

```bash
# Terminal 1
cd certauth/backend && npm install && npm run dev

# Terminal 2
cd certauth/frontend && npm install && npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/verify-otp | Verify email OTP |
| POST | /api/auth/login | Login |
| POST | /api/auth/verify-2fa | Verify 2FA token |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/setup-2fa | Setup 2FA |
| POST | /api/auth/enable-2fa | Enable 2FA |
| POST | /api/certificates/issue | Issue certificate (auth) |
| GET | /api/certificates | List certificates (auth) |
| GET | /api/certificates/:id | Get certificate |
| PUT | /api/certificates/:id/revoke | Revoke certificate |
| GET | /api/verify/:certId | Public verify by ID |
| POST | /api/verify/hash | Verify by document hash |
| GET | /api/analytics | Analytics data (auth) |

---

## 🔐 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, React Router v6 |
| UI | Custom CSS (no frameworks), CSS Variables |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| 2FA | speakeasy (TOTP) |
| Email | Nodemailer |
| Hashing | crypto (SHA-256) |
| QR Code | qrcode |
| File Upload | multer |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| Admin | Issue, revoke, analytics, all records |
| Institution | Issue, revoke, analytics, own records |
| Student | View own certificates |
| Employer | Public verify only |

---

## 🏆 SIH Requirements Met

- ✅ Design WebPages — Full responsive React app
- ✅ Express.js web application
- ✅ Email with Nodemailer Module
- ✅ File handling with multer + streams
- ✅ Node.js server-side programming
- ✅ Node.js + MongoDB custom application
- ✅ React components, JSX, Props, Events
- ✅ Custom forms with React
- ✅ useCallback, useState, useEffect, useRef hooks
- ✅ TypeScript for enhanced web application
- ✅ Webpack (via Create React App)
