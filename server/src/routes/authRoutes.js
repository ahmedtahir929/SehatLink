/**
 * SehatLink - Auth Routes
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: US-01
 */

import express from 'express';
import { registerPatient } from '../controllers/patientController.js';

const router = express.Router();

// US-01: Patient Registration
router.post('/register/patient', registerPatient);

export { router };
export default router;
