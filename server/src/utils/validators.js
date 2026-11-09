/**
 * SehatLink - Input Validation Suite
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * User Story References: US-01, US-04, US-05, US-07, US-27, US-30
 * Meets OWASP Top 10 Input Validation & Acceptance Criteria
 */

/**
 * Validates Full Name: Required, letters and spaces only, max 50 characters.
 * @param {string} name 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateFullName(name) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return { valid: false, message: 'Full Name is required' };
  }
  const trimmed = name.trim();
  if (trimmed.length > 50) {
    return { valid: false, message: 'Full Name must not exceed 50 characters' };
  }
  // Letters and single spaces between words only
  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, message: 'Full Name must contain letters and spaces only' };
  }
  return { valid: true };
}

/**
 * Validates Email Address format.
 * @param {string} email 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return { valid: false, message: 'Email is required' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
}

/**
 * Validates Pakistani Mobile Number: 03XX-XXXXXXX format.
 * @param {string} mobile 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateMobileNumber(mobile) {
  if (!mobile || typeof mobile !== 'string' || mobile.trim() === '') {
    return { valid: false, message: 'Mobile number is required' };
  }
  const trimmed = mobile.trim();
  const mobileRegex = /^03\d{2}-\d{7}$/;
  if (!mobileRegex.test(trimmed)) {
    return { valid: false, message: 'Mobile number must match format 03XX-XXXXXXX' };
  }
  return { valid: true };
}

/**
 * Validates Password per US-01 & US-04 Acceptance Criteria:
 * 8-20 characters with uppercase, lowercase, digit, and special character.
 * @param {string} password 
 * @returns {{ valid: boolean, message?: string }}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8 || password.length > 20) {
    return { valid: false, message: 'Password must be between 8 and 20 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit' };
  }
  // Common safe special characters
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

/**
 * Validates Registration payload (US-01)
 * @param {object} data 
 * @returns {{ valid: boolean, errors: object }}
 */
function validatePatientRegistration(data) {
  const errors = {};

  const nameVal = validateFullName(data.name);
  if (!nameVal.valid) errors.name = nameVal.message;

  const emailVal = validateEmail(data.email);
  if (!emailVal.valid) errors.email = emailVal.message;

  const mobileVal = validateMobileNumber(data.mobile);
  if (!mobileVal.valid) errors.mobile = mobileVal.message;

  const pwdVal = validatePassword(data.password);
  if (!pwdVal.valid) errors.password = pwdVal.message;

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Consultation Fee (US-07): Positive whole number only.
 * @param {any} fee 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateConsultationFee(fee) {
  const num = Number(fee);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return { valid: false, message: 'Consultation fee must be a positive whole number' };
  }
  return { valid: true };
}

/**
 * Validates Doctor Profile edit fields (US-07)
 * @param {object} data 
 * @returns {{ valid: boolean, errors: object }}
 */
function validateDoctorProfile(data) {
  const errors = {};

  if (!data.bio || data.bio.trim() === '') {
    errors.bio = 'Bio is required';
  } else if (data.bio.trim().length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  if (!data.qualifications || (Array.isArray(data.qualifications) && data.qualifications.length === 0)) {
    errors.qualifications = 'At least one qualification is required';
  }

  if (!data.clinicAddress || data.clinicAddress.trim() === '') {
    errors.clinicAddress = 'Clinic address is required';
  }

  if (data.consultationFee !== undefined) {
    const feeVal = validateConsultationFee(data.consultationFee);
    if (!feeVal.valid) errors.consultationFee = feeVal.message;
  } else {
    errors.consultationFee = 'Consultation fee is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates Doctor Rating (US-27): 1 to 5 stars, optional comment max 300 chars.
 * @param {number} rating 
 * @param {string} comment 
 * @returns {{ valid: boolean, message?: string }}
 */
function validateReview(rating, comment) {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { valid: false, message: 'Rating must be an integer between 1 and 5' };
  }
  if (comment && typeof comment === 'string' && comment.length > 300) {
    return { valid: false, message: 'Comment cannot exceed 300 characters' };
  }
  return { valid: true };
}

/**
 * Validates Prescription (US-30): At least notes or one medicine must be provided.
 * @param {object} prescription 
 * @returns {{ valid: boolean, errors: object }}
 */
function validatePrescription(prescription) {
  const errors = {};
  const hasNotes = prescription.notes && prescription.notes.trim().length > 0;
  const hasMedicines = Array.isArray(prescription.medicines) && prescription.medicines.length > 0;

  if (!hasNotes && !hasMedicines) {
    errors.content = 'At least consultation notes or one prescribed medicine must be provided';
  }

  if (hasMedicines) {
    prescription.medicines.forEach((med, idx) => {
      if (!med.name || med.name.trim() === '') {
        errors[`medicine_${idx}_name`] = `Medicine #${idx + 1} name is required`;
      }
      if (!med.dosage || med.dosage.trim() === '') {
        errors[`medicine_${idx}_dosage`] = `Medicine #${idx + 1} dosage is required`;
      }
    });
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export {
  validateFullName,
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validatePatientRegistration,
  validateConsultationFee,
  validateDoctorProfile,
  validateReview,
  validatePrescription
};
