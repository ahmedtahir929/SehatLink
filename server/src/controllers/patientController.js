/**
 * SehatLink - Patient Account & Profile Controller
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: US-01 (Patient Registration)
 */

import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import { ROLES, USER_STATUS } from '../config/constants.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { generatePatientId } from '../utils/idGenerator.js';
import { validatePatientRegistration } from '../utils/validators.js';

/**
 * US-01: Register a new patient account
 */
async function registerPatient(req, res, next) {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    // 1. Validate form fields
    const validation = validatePatientRegistration({ name, email, mobile, password, confirmPassword });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // 2. Uniqueness check (US-01 AC 4)
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        errors: { email: 'Email already registered' }
      });
    }

    // 3. Hash password (SEC-01 / US-01 AC 5)
    const hashedPassword = await hashPassword(password);

    // 4. Generate unique Patient ID (US-01 AC 5)
    const patientId = generatePatientId();

    // 5. Persist user and patient profile
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: ROLES.PATIENT,
      status: USER_STATUS.ACTIVE
    });

    const patientProfile = await PatientProfile.create({
      patientId,
      userId: newUser._id,
      name: name.trim(),
      email: newUser.email,
      mobile: mobile.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You may now log in.',
      patientId: patientProfile.patientId,
      redirectUrl: '/login'
    });
  } catch (error) {
    next(error);
  }
}

export {
  registerPatient
};
