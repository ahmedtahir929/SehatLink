/**
 * SehatLink - Authentication Middleware
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: SEC-02, SEC-03, US-03, US-06
 */

import { verifyToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';
import { USER_STATUS } from '../config/constants.js';

/**
 * Verifies JWT token and attaches user to request
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Token missing.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    // Verify user exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administration.'
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    next(error);
  }
}

export {
  authenticate
};
