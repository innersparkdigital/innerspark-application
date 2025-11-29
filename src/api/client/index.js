/**
 * Client API - Barrel Export
 * 
 * Re-exports all client API functions from feature modules.
 * This allows clean imports: import { getTodayMood, getGoals } from '../api/client'
 */

// Dashboard & Home
export * from './dashboard';

// Profile
export * from './profile';

// Mood Tracking
export * from './mood';

// Journal
export * from './journal';

// Goals (Placeholder - Backend will add later)
export * from './goals';

// Therapists (Placeholder - Backend will add later)
export * from './therapists';

// Appointments (Placeholder - Backend will add later)
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

// Notifications
export * from './notifications';

// Emergency
export * from './emergency';

// Wallet
export * from './wallet';

// Subscriptions & Billing
export * from './subscriptions';

// Account & Data Management
export * from './account';

// File Uploads (Utility)
export * from './uploads';

// Test Helper (Development/QA)
export * from './clientApiTestHelper';
