/**
 * SehatLink - System Constants & Business Rules Configuration
 * Author: Ahmed Tahir (L1F23BSSE0123)
 * Role: Scrum Master, Backend System Architect, MongoDB Schema & Escrow Lead
*/

const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

const USER_STATUS = {
  ACTIVE: 'active',
  PENDING_VERIFICATION: 'pending_verification',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

export { ROLES, USER_STATUS };
