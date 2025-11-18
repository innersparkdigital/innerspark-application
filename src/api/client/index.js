/**
 * Client API - Barrel Export
 * 
 * Re-exports all client API functions from feature modules.
 * This allows clean imports: import { getTodayMood, getGoals } from '../api/client'
 */

// Dashboard & Home
export * from './dashboard';

// Mood Tracking
export * from './mood';

// Goals
export * from './goals';

// Therapists
export * from './therapists';

// Appointments
export * from './appointments';

// Events
export * from './events';

// Support Groups
export * from './groups';

// Messages/Chat
export * from './messages';

// Meditations
export * from './meditations';

// Settings
export * from './settings';

// File Uploads
export * from './uploads';

// Notifications
export * from './notifications';
