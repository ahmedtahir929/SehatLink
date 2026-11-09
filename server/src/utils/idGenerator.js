/**
 * SehatLink - Unique Domain Identifiers Generator
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: US-01 (Unique Patient ID), US-02, US-13
 */

import crypto from 'crypto';

/**
 * Generates human-readable, unique Patient ID: PID-YYYY-XXXX
 * @returns {string}
 */
function generatePatientId() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PID-${year}-${randomHex}`;
}

/**
 * Generates Doctor ID: DOC-YYYY-XXXX
 * @returns {string}
 */
function generateDoctorId() {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DOC-${year}-${randomHex}`;
}

/**
 * Generates Appointment Booking Reference: APT-YYYYMMDD-XXXX
 * @returns {string}
 */
function generateBookingReference() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `APT-${ymd}-${randomSuffix}`;
}

export {
  generatePatientId,
  generateDoctorId,
  generateBookingReference
};
