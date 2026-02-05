/**
 * Therapist API - Barrel Export
 * 
 * Re-exports all therapist API functions from feature modules.
 * This allows clean imports: import { getDashboardStats, getAppointments } from '../api/therapist'
 */

// Dashboard & Profile
export * from './dashboard';

// Appointments
export * from './appointments';

// Clients
export * from './clients';

// Messages & Chat
export * from './messages';

// Events
export * from './events';

// Support Groups
export * from './groups';

// Group Members
export * from './groupMembers';

// Session Notes
export * from './sessionNotes';

// Assessments
export * from './assessments';

// Calendar & Availability
export * from './calendar';

// Earnings & Pricing
export * from './earnings';

// Reviews & Transactions
export * from './reviews';

// Notifications
export * from './notifications';

// Analytics
export * from './analytics';

// Utilities
export * from './utilities';

// Requests
export * from './requests';
