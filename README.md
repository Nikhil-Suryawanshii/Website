# AgenticOS — Full MERN Stack

Complete project with React (JSX) frontend + Node/Express/MongoDB backend.

---

## 📁 Structure

```
AgenticOS_MERN/
├── backend/                  ← Express API (ES Modules)
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Service.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── services.js
│   ├── middleware/auth.js
│   ├── seed/seedServices.js
│   ├── .env.example
│   └── package.json
│
└── frontend/                 ← React + Vite (all .jsx files)
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── services/api.js
        ├── hooks/
        │   ├── useAuth.js
        │   └── useServices.js
        └── components/
            ├── Navbar.jsx
            ├── Hero.jsx
            ├── Services.jsx
            ├── Transform.jsx
            ├── Booking.jsx
            ├── CalendlyModal.jsx
            ├── ClientLoginModal.jsx
            └── Footer.jsx
```

---

## 🚀 Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm run seed       # Seed DB with services + create admin user
npm run dev        # Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already has: VITE_API_URL=http://localhost:5000
npm run dev        # Runs on http://localhost:3000
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | — | Health check |
| GET | /api/services | — | All services (used by frontend) |
| POST | /api/bookings | — | Submit lead before Calendly |
| POST | /api/auth/login | — | Login → JWT |
| POST | /api/auth/register | — | Register → JWT |
| GET | /api/auth/me | Bearer | Current user |
| GET | /api/bookings | Admin | All leads |
| GET | /api/bookings/stats | Admin | Dashboard stats |
| PUT | /api/bookings/:id | Admin | Update status/notes |
| PUT | /api/services/:slug | Admin | Edit service content |

---

## 🗄️ Default Admin

After running `npm run seed`:
```
Email:    admin@agenticos.com
Password: Admin@123456
```
Change these in `.env` before going to production.

---

## 🌐 Production

**Backend** — Railway / Render / any Node host:
- Set all `.env` variables
- Set `NODE_ENV=production`
- Use MongoDB Atlas for `MONGO_URI`
- Run `npm start`

**Frontend** — Vercel / Netlify:
- Set `VITE_API_URL=https://your-backend.com`
- Build: `npm run build` → deploy `dist/`
