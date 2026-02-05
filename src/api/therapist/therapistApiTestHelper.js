/**
 * Therapist API Test Helper
 * 
 * Quick manual tests for the therapist API endpoints.
 * Run this in DevTestScreen with a valid therapist_id.
 */

import {
    // Dashboard
    getDashboardStats,
    getTherapistProfile,

    // Appointments
    getAppointments,
    getAppointmentById,

    // Clients
    getClients,
    getClientProfile,

    // Messages
    getConversations,
    getChatMessages,

    // Session Notes
    getSessionNotes,

    // Events
    getEvents,
    getEventById,
    getEventAttendees,

    // Groups
    getGroups,
    getGroupById,
    getGroupMessages,

    // Group Members
    getGroupMembers,

    // Assessments
    getAssessments,
    getAssessmentById,

    // Calendar
    getAvailabilitySlots,
    getBookedSlots,

    // Earnings
    getEarnings,
    getPricingRates,

    // Reviews
    getReviews,
    getTransactions,

    // Notifications
    getNotifications,

    // Analytics
    getAnalyticsOverview,
    getSessionAnalytics,
    getRevenueAnalytics,
} from './index';

/**
 * Test all Therapist GET endpoints (safe to run)
 * 
 * @param {string} therapistId - Test therapist ID
 * @returns {Promise<Object>} Test results with passed/failed arrays
 */
export const testAllTherapistGetEndpoints = async (therapistId) => {
    // Import here to avoid circular dependencies
    const { baseUrl } = require('../LHAPI');

    console.log('🧪 Starting Therapist API Tests...\n');
    console.log(`👨‍⚕️ Therapist ID: ${therapistId}`);
    console.log(`🌐 API Base URL: ${baseUrl}`);
    console.log(`📍 Testing against: ${baseUrl}/th/*\n`);

    const tests = [
        // Dashboard (2 endpoints)
        { name: 'Dashboard Stats', fn: () => getDashboardStats(therapistId) },
        { name: 'Therapist Profile', fn: () => getTherapistProfile(therapistId) },

        // Appointments (2 GET endpoints from 6 total)
        { name: 'Appointments List', fn: () => getAppointments(therapistId, {}) },
        { name: 'Appointment Details', fn: () => getAppointmentById('test-appt-id', therapistId) },

        // Clients (2 endpoints)
        { name: 'Clients List', fn: () => getClients(therapistId, {}) },
        { name: 'Client Profile', fn: () => getClientProfile('test-client-id', therapistId) },

        // Messages (2 GET endpoints from 4 total)
        { name: 'Conversations', fn: () => getConversations(therapistId) },
        { name: 'Chat Messages', fn: () => getChatMessages('test-client-id', therapistId, 1, 50) },

        // Session Notes (2 GET endpoints from 5 total)
        { name: 'Session Notes', fn: () => getSessionNotes('test-client-id', therapistId) },

        // Events (3 GET endpoints from 9 total)
        { name: 'Events List', fn: () => getEvents(therapistId, {}) },
        { name: 'Event Details', fn: () => getEventById('test-event-id', therapistId) },
        { name: 'Event Attendees', fn: () => getEventAttendees('test-event-id', therapistId) },

        // Groups (3 GET endpoints from 9 total)
        { name: 'Groups List', fn: () => getGroups(therapistId, {}) },
        { name: 'Group Details', fn: () => getGroupById('test-group-id', therapistId) },
        { name: 'Group Messages', fn: () => getGroupMessages('test-group-id', therapistId, 1, 50) },

        // Group Members (2 GET endpoints from 6 total)
        { name: 'Group Members', fn: () => getGroupMembers('test-group-id', therapistId, {}) },

        // Assessments (2 GET endpoints from 7 total)
        { name: 'Assessments List', fn: () => getAssessments(therapistId, {}) },
        { name: 'Assessment Details', fn: () => getAssessmentById('test-assessment-id', therapistId) },

        // Calendar (2 GET endpoints from 9 total)
        { name: 'Availability Slots', fn: () => getAvailabilitySlots(therapistId, {}) },
        { name: 'Booked Slots', fn: () => getBookedSlots(therapistId, {}) },

        // Earnings (2 GET endpoints from 5 total)
        { name: 'Earnings Summary', fn: () => getEarnings(therapistId, {}) },
        { name: 'Pricing Rates', fn: () => getPricingRates(therapistId) },

        // Reviews (2 endpoints)
        { name: 'Reviews List', fn: () => getReviews(therapistId, {}) },
        { name: 'Transactions', fn: () => getTransactions(therapistId, {}) },

        // Notifications (1 GET endpoint from 3 total)
        { name: 'Notifications', fn: () => getNotifications(therapistId, false) },

        // Analytics (3 endpoints)
        { name: 'Analytics Overview', fn: () => getAnalyticsOverview(therapistId, 'month') },
        { name: 'Session Analytics', fn: () => getSessionAnalytics(therapistId, 'month') },
        { name: 'Revenue Analytics', fn: () => getRevenueAnalytics(therapistId, 'month') },
    ];

    const results = {
        passed: [],
        failed: [],
        total: tests.length,
    };

    for (const test of tests) {
        try {
            console.log(`Testing: ${test.name}...`);
            const data = await test.fn();
            console.log(`✅ ${test.name}: Success`);
            console.log(`   Response:`, data ? 'Data received' : 'Empty response');
            results.passed.push(test.name);
        } catch (error) {
            console.error(`❌ ${test.name}: Failed`);
            console.error(`   Error: ${error.message}`);

            // Show more details for debugging
            if (error.response) {
                console.error(`   Status: ${error.response.status}`);
                console.error(`   URL: ${error.config?.url || 'Unknown'}`);
                if (error.response.status === 404) {
                    console.error(`   ⚠️  Endpoint not implemented on backend`);
                }
                // Log response body for 404s to see if it's the "no data" pattern
                if (error.response.status === 404 && error.response.data) {
                    console.error(`   Response body:`, error.response.data);
                }
            }

            results.failed.push({
                name: test.name,
                error: error.message,
                status: error.response?.status,
                url: error.config?.url,
            });
        }
        console.log('---');
    }

    // Summary
    console.log('\n📊 THERAPIST API TEST SUMMARY:');
    console.log(`✅ Passed: ${results.passed.length}/${tests.length}`);
    console.log(`❌ Failed: ${results.failed.length}/${tests.length}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed.length / tests.length) * 100)}%`);

    if (results.failed.length > 0) {
        console.log('\n❌ Failed Tests:');
        results.failed.forEach(({ name, error, status }) => {
            console.log(`  - ${name}: ${error} (Status: ${status || 'N/A'})`);
        });
    }

    return results;
};

/**
 * Test specific endpoint with custom parameters
 * 
 * @param {string} endpointName - Name of the endpoint
 * @param {Function} fn - Function to test
 * @param {Array} params - Parameters to pass to function
 * @returns {Promise<Object>} Result with success/error
 */
export const testEndpoint = async (endpointName, fn, params) => {
    console.log(`🧪 Testing ${endpointName}...`);

    try {
        const result = await fn(...params);
        console.log(`✅ Success:`, result);
        return { success: true, data: result };
    } catch (error) {
        console.error(`❌ Failed:`, error.message);
        return { success: false, error: error.message };
    }
};
