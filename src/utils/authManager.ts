/**
 * Authentication Manager
 * Handles authentication-related operations including comprehensive logout
 */
import store from '../app/store';
import { signout } from '../features/user/userSlice';
import { resetUserData } from '../features/user/userDataSlice';
import { resetMoodState } from '../features/mood/moodSlice';
import { clearAppointments } from '../features/appointments/appointmentsSlice';
import { clearGoals } from '../features/goals/goalsSlice';
import { clearChat } from '../features/chat/chatSlice';
import { clearWallet } from '../features/wallet/walletSlice';
import { clearRegisteredEventIds } from '../features/events/eventsSlice';
import { clearNotifications } from '../features/notifications/notificationSlice';
import { removeItemLS } from '../global/StorageActions';

/**
 * Perform comprehensive logout
 * Clears all user-sensitive data from Redux stores and local storage
 * to prevent data leakage between different user sessions
 * 
 * @example
 * import { performLogout } from '../utils/authManager';
 * 
 * const handleLogout = () => {
 *   performLogout();
 *   // User is now logged out with all data cleared
 * };
 */
export const performLogout = () => {
  const dispatch = store.dispatch;

  // 1. Clear Redux authentication state
  dispatch(signout());
  
  // 2. Clear Redux user data (profile, notifications, etc.)
  dispatch(resetUserData());
  
  // 3. Clear Redux mood tracking data (check-ins, streaks, history)
  dispatch(resetMoodState());
  
  // 4. Clear Redux appointments data
  dispatch(clearAppointments());
  
  // 5. Clear Redux goals data
  dispatch(clearGoals());
  
  // 6. Clear Redux chat data (conversations, messages)
  dispatch(clearChat());
  
  // 7. Clear Redux wallet data (balance, transactions)
  dispatch(clearWallet());
  
  // 8. Clear Redux registered events
  dispatch(clearRegisteredEventIds());
  
  // 9. Clear Redux notifications
  dispatch(clearNotifications());
  
  // 10. Clear all local storage
  removeItemLS("userToken");
  removeItemLS("userDetailsLS");
  removeItemLS("userAvatarLS");
  
  // Note: Other slices (subscription, emergency, settings, dashboard, therapists, reports, supportTickets)
  // will be refreshed from API on next login, so no need to explicitly clear them
};
