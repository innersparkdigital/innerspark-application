/**
 * Client API Test Helper
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
} from './index';

/**
 * Test all GET endpoints (safe to run)
 * 
 * @param {string} userId - Test user ID
 * @returns {Promise<Object>} Test results with passed/failed arrays
 */
export const testAllGetEndpoints = async (userId) => {
  // Import here to avoid circular dependencies
  const { baseUrl } = require('../LHAPI');
  
  console.log('🧪 Starting Client API Tests...\n');
  console.log(`📋 User ID: ${userId}`);
  console.log(`🌐 API Base URL: ${baseUrl}`);
  console.log(`📍 Testing against: ${baseUrl}/client/*\n`);
  
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
  console.log('\n📊 TEST SUMMARY:');
  console.log(`✅ Passed: ${results.passed.length}/${tests.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${tests.length}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed.length / tests.length) * 100)}%`);
  
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

/**
 * Example usage in a screen:
 * 
 * import { testAllGetEndpoints } from '../api/client/clientApiTestHelper';
 * import { useSelector } from 'react-redux';
 * 
 * const MyScreen = () => {
 *   const userId = useSelector(state => state.user.userDetails.userId);
 * 
 *   const runTests = async () => {
 *     const results = await testAllGetEndpoints(userId);
 *     console.log('Test Results:', results);
 *   };
 * 
 *   return <Button title="Run Tests" onPress={runTests} />;
 * };
 */
