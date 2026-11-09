/**
 * SehatLink - Express Application Setup & Security Hardening
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Role: Backend System Architect
 * Standards: OWASP Top 10, Modular Architecture (MNT-01)
 */

import express from 'express';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';

const app = express();

// Body Parsing with payload size safety (2MB photo support)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate limiting on sensitive auth endpoints (SEC-04)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Mount Routes
app.use('/api/v1/auth', authLimiter, authRoutes);

export { app };
export default app;
