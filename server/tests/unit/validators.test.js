/**
 * SehatLink - Validator Unit Tests
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Reference: Table 21 (validatePassword) & Acceptance Criteria US-01, US-05, US-07, US-27, US-30
 */

import {
  validateFullName,
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validatePatientRegistration,
  validateConsultationFee,
  validateDoctorProfile,
  validateReview,
  validatePrescription
} from '../../src/utils/validators.js';

describe('Table 21 Unit Test: validatePassword(pwd)', () => {
  test('Passes for valid password "Abc@1234"', () => {
    const result = validatePassword('Abc@1234');
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  test('Rejects short password "abc"', () => {
    const result = validatePassword('abc');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/between 8 and 20 characters/);
  });

  test('Rejects password without lowercase letter "ABCDEFGH1!"', () => {
    const result = validatePassword('ABCDEFGH1!');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/at least one lowercase letter/);
  });

  test('Rejects 21-character string exceeding maximum length', () => {
    const longPwd = 'Abc@12345678901234567'; // 21 chars
    const result = validatePassword(longPwd);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/between 8 and 20 characters/);
  });
});

describe('US-01: Patient Registration Field Validators', () => {
  test('validateFullName enforces letters and max 50 chars', () => {
    expect(validateFullName('Ahmed Tahir').valid).toBe(true);
    expect(validateFullName('Ahmed123').valid).toBe(false);
    expect(validateFullName('   ').valid).toBe(false);
    expect(validateFullName('A'.repeat(51)).valid).toBe(false);
  });

  test('validateEmail validates RFC compliant email formats', () => {
    expect(validateEmail('ahmed.tahir@ucp.edu.pk').valid).toBe(true);
    expect(validateEmail('invalid-email').valid).toBe(false);
    expect(validateEmail('@domain.com').valid).toBe(false);
  });

  test('validateMobileNumber validates 03XX-XXXXXXX format', () => {
    expect(validateMobileNumber('0300-1234567').valid).toBe(true);
    expect(validateMobileNumber('0345-9876543').valid).toBe(true);
    expect(validateMobileNumber('042-1234567').valid).toBe(false);
    expect(validateMobileNumber('03001234567').valid).toBe(false);
  });

  test('validatePatientRegistration requires password match', () => {
    const validData = {
      name: 'Ahmed Tahir',
      email: 'ahmed@example.com',
      mobile: '0300-1234567',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    };
    expect(validatePatientRegistration(validData).valid).toBe(true);

    const mismatched = { ...validData, confirmPassword: 'DifferentPassword@123' };
    const mismatchRes = validatePatientRegistration(mismatched);
    expect(mismatchRes.valid).toBe(false);
    expect(mismatchRes.errors.confirmPassword).toBe('Passwords do not match');
  });
});

describe('US-07: Doctor Profile Validation', () => {
  test('validateConsultationFee accepts only positive whole numbers', () => {
    expect(validateConsultationFee(2000).valid).toBe(true);
    expect(validateConsultationFee('1500').valid).toBe(true);
    expect(validateConsultationFee(0).valid).toBe(false);
    expect(validateConsultationFee(-500).valid).toBe(false);
    expect(validateConsultationFee(1500.50).valid).toBe(false);
    expect(validateConsultationFee('abc').valid).toBe(false);
  });

  test('validateDoctorProfile enforces required bio, qualifications, and clinic address', () => {
    const validDoctor = {
      bio: 'Experienced Consultant Pediatrician with 10 years of clinical practice.',
      qualifications: ['MBBS', 'FCPS Pediatrics'],
      clinicAddress: 'Shaukat Khanum OPD Clinic, Jail Road, Lahore',
      consultationFee: 2500
    };
    expect(validateDoctorProfile(validDoctor).valid).toBe(true);

    const invalidDoctor = {
      bio: 'A'.repeat(501), // > 500 chars
      qualifications: [],
      clinicAddress: '',
      consultationFee: -100
    };
    const res = validateDoctorProfile(invalidDoctor);
    expect(res.valid).toBe(false);
    expect(res.errors.bio).toBeDefined();
    expect(res.errors.qualifications).toBeDefined();
    expect(res.errors.clinicAddress).toBeDefined();
    expect(res.errors.consultationFee).toBeDefined();
  });
});

describe('US-27: Doctor Review Validation', () => {
  test('Enforces 1-5 rating range and 300 character comment limit', () => {
    expect(validateReview(5, 'Excellent doctor. Highly punctual and empathetic.').valid).toBe(true);
    expect(validateReview(0, 'Terrible').valid).toBe(false);
    expect(validateReview(6, 'Great').valid).toBe(false);
    expect(validateReview(4, 'x'.repeat(301)).valid).toBe(false);
  });
});

describe('US-30: Digital Prescription Validation', () => {
  test('Requires either consultation notes or at least one medicine', () => {
    expect(validatePrescription({ notes: 'Rest for 3 days and drink fluids' }).valid).toBe(true);
    expect(validatePrescription({ medicines: [{ name: 'Paracetamol', dosage: '500mg' }] }).valid).toBe(true);
    expect(validatePrescription({ notes: '', medicines: [] }).valid).toBe(false);
  });
});
