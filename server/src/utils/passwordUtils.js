/**
 * SehatLink - Password Utilities (Bcrypt Hashing)
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: SEC-01, Table 21 (hashPassword / comparePassword)
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password with bcrypt salt
 * @param {string} plainPassword 
 * @returns {Promise<string>}
 */
async function hashPassword(plainPassword) {
  if (!plainPassword) {
    throw new Error('Password string is required for hashing');
  }
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password against hash
 * @param {string} plainPassword 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
}

export {
  hashPassword,
  comparePassword
};
