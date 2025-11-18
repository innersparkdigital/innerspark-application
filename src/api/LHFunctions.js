/**
 * InnerSpark API Functions - DEPRECATED
 * @author: InnerSpark Dev Team
 * @date: 2025-09-17
 * 
 * ⚠️ DEPRECATION NOTICE ⚠️
 * This file is kept for backward compatibility during migration.
 * 
 * NEW STRUCTURE:
 * - Client API: import from '../api/client'
 * - Therapist API: import from '../api/therapist'
 * - Shared API: import from '../api/shared'
 * 
 * Please update your imports to use the new structure.
 * This file will be removed in a future version.
 */

// Re-export from new structure for backward compatibility
export * from './client';
export * from './shared';

// Log deprecation warning (only once)
let hasWarned = false;
if (!hasWarned) {
    console.warn(
        '⚠️ DEPRECATION WARNING: LHFunctions.js is deprecated.\n' +
        'Please update imports:\n' +
        '  - Client: import from "../api/client"\n' +
        '  - Therapist: import from "../api/therapist"\n' +
        '  - Shared: import from "../api/shared"'
    );
    hasWarned = true;
}



