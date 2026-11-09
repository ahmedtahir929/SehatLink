/**
 * SehatLink - Centralized Error Handler & Audit Logging
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Role: Backend System Architect
 * Requirements: REL-06, SEC-04
 */

import crypto from 'crypto';

function errorHandler(err, req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const anonymizedUserId = req.user ? `user_***${req.user.id.slice(-4)}` : 'unauthenticated';

  // Structured logging per REL-06
  console.error(JSON.stringify({
    timestamp,
    requestId,
    userId: anonymizedUserId,
    path: req.originalUrl,
    method: req.method,
    errorMessage: err.message,
    name: err.name
  }));

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      requestId
    });
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      requestId
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error occurred' : err.message,
    requestId
  });
}

export {
  errorHandler
};
