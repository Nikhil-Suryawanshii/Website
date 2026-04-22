import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';

connectDB();

const app = express();

// Rate limiters
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  message: { success: false, message: 'Too many requests, try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 15,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  ...(process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(limiter);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'AgenticOS API running 🚀', env: process.env.NODE_ENV });
});

// Routes
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID.' });
  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: msgs.join(', ') });
  }
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token.' });
  if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired.' });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  AgenticOS API → http://localhost:${PORT}`);
  console.log(`🩺  Health      → http://localhost:${PORT}/api/health\n`);
});
