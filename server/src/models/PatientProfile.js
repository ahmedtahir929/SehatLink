/**
 * SehatLink - Patient Profile Schema
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Requirements: US-01, US-05, US-15, US-28
 * Features: Unique Patient ID (read-only), personal doctors (max 3), no-show tracking
 */

import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    allergies: {
      type: [String],
      default: []
    },
    personalDoctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorProfile'
      }
    ],
    noShowCount: {
      type: Number,
      default: 0
    },
    flaggedForAdmin: {
      type: Boolean,
      default: false
    },
    pendingNewEmail: {
      type: String,
      default: null
    },
    emailVerificationToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
export { PatientProfile };
export default PatientProfile;
