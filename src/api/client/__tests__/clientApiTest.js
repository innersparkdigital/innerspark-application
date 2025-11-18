/**
 * Client API Test File
 * 
 * Quick manual tests for the refactored client API.
 * Run this in a screen or test environment with a valid user_id.
 */

import {
  // Dashboard
  getDashboardData,
  
  // Profile
  getProfile,
  
  // Mood
  getTodayMood,
  getMoodHistory,
  getMoodInsights,
  
  // Groups
  getGroups,
  getMyGroups,
  
  // Messages
  getChats,
  
  // Events
  getEvents,
  
  // Meditations
  getMeditationArticles,
  getDailyQuote,
  
  // Wallet
  getWalletTransactions,
  
  // Journal
  getJournalEntries,
  
  // Emergency
  getEmergencyContacts,
  getSafetyPlan,
  
  // Subscriptions
  getPlans,
  getCurrentSubscription,
  
  // Settings
  getUserSettings,
  
  // Account
  // requestDataExport, deactivateAccount, deleteAccount - Don't test these!
} from '../index';

/**
 * Test all GET endpoints (safe to run)
 * 
 * @param {string} userId - Test user ID
 */
export const testAllGetEndpoints = async (userId) => {
  console.log('🧪 Starting Client API Tests...\n');
  
  const tests = [
    { name: 'Dashboard', fn: () => getDashboardData(userId) },
    { name: 'Profile', fn: () => getProfile(userId) },
    { name: 'Today Mood', fn: () => getTodayMood(userId) },
    { name: 'Mood History', fn: () => getMoodHistory(userId) },
    { name: 'Mood Insights', fn: () => getMoodInsights(userId) },
    { name: 'Groups List', fn: () => getGroups(userId, 1, 10) },
    { name: 'My Groups', fn: () => getMyGroups(userId) },
    { name: 'Chats', fn: () => getChats(userId) },
    { name: 'Events', fn: () => getEvents(1, 10) },
    { name: 'Meditation Articles', fn: () => getMeditationArticles(1, 10) },
    { name: 'Daily Quote', fn: () => getDailyQuote(userId) },
    { name: 'Wallet Transactions', fn: () => getWalletTransactions(userId, 1, 10) },
    { name: 'Journal Entries', fn: () => getJournalEntries(userId, 1, 10) },
    { name: 'Emergency Contacts', fn: () => getEmergencyContacts(userId) },
    { name: 'Safety Plan', fn: () => getSafetyPlan(userId) },
    { name: 'Subscription Plans', fn: () => getPlans(userId) },
    { name: 'Current Subscription', fn: () => getCurrentSubscription(userId) },
    { name: 'User Settings', fn: () => getUserSettings(userId) },
  ];
  
  const results = {
    passed: [],
    failed: [],
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
      results.failed.push({ name: test.name, error: error.message });
    }
    console.log('---');
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log(`✅ Passed: ${results.passed.length}/${tests.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${tests.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }
  
  return results;
};

/**
 * Test specific endpoint with custom parameters
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

/**
 * Example usage in a screen:
 * 
 * import { testAllGetEndpoints } from '../api/client/__tests__/clientApiTest';
 * 
 * // In your component
 * const runTests = async () => {
 *   const userId = userDetailsData.userId; // Get from Redux
 *   const results = await testAllGetEndpoints(userId);
 * };
 */
