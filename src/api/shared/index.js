/**
 * Shared API - Barrel Export
 * 
 * Re-exports all shared API functions used by both client and therapist flows.
 * This allows clean imports: import { login, updateProfile } from '../api/shared'
 */

// Authentication
export * from './auth';

// Profile Management
export * from './profile';

// Notifications (Backend API calls)
export * from './notifications';

// Redux Data Loader (Background data loading)
export * from './reduxDataLoader';
