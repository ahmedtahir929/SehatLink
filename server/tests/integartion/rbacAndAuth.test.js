/**
 * SehatLink - RBAC & Authentication Integration Tests
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Reference: Table 21 (authorizeRole), US-01, SEC-02, SEC-03
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import PatientProfile from '../../src/models/PatientProfile.js';
import { ROLES, USER_STATUS } from '../../src/config/constants.js';

describe('US-01: Patient Registration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Registration fails when required fields are missing or invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/patient')
      .send({
        name: 'Ahmed123', // Invalid name
        email: 'bad-email',
        mobile: '12345',
        password: 'weak'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.name).toMatch(/letters and spaces only/);
    expect(res.body.errors.email).toMatch(/Invalid email format/);
    expect(res.body.errors.mobile).toMatch(/03XX-XXXXXXX/);
    expect(res.body.errors.password).toMatch(/between 8 and 20 characters/);
  });

  test('Registration rejects duplicate email with clear message (US-01 AC 4)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ email: 'ahmed.tahir@ucp.edu.pk' });

    const res = await request(app)
      .post('/api/v1/auth/register/patient')
      .send({
        name: 'Ahmed Tahir',
        email: 'ahmed.tahir@ucp.edu.pk',
        mobile: '0300-1234567',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already registered');
  });

  test('Successful registration returns unique Patient ID and redirect url (US-01 AC 5)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockResolvedValue({
      _id: '64f000000000000000000099',
      email: 'new.patient@ucp.edu.pk',
      role: ROLES.PATIENT,
      status: USER_STATUS.ACTIVE
    });
    jest.spyOn(PatientProfile, 'create').mockResolvedValue({
      patientId: 'PID-2026-A1B2C3',
      name: 'Ahmed Tahir'
    });

    const res = await request(app)
      .post('/api/v1/auth/register/patient')
      .send({
        name: 'Ahmed Tahir',
        email: 'new.patient@ucp.edu.pk',
        mobile: '0300-1234567',
        password: 'Password@123',
        confirmPassword: 'Password@123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.patientId).toMatch(/^PID-\d{4}-[A-F0-9]{6}$/);
    expect(res.body.redirectUrl).toBe('/login');
  });
});