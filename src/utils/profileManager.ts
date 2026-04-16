/**
 * Profile Manager
 * Handles profile fetching, synchronization, and persistence
 */
import store from '../app/store';
import { setUserProfile } from '../features/user/userDataSlice';
import { getProfile } from '../api/client/profile';
import { storeItemLS } from '../global/StorageActions';

/**
 * Refresh user profile data from API and synchronize with local storage
 * @param userId - ID of the user to refresh
 * @returns Promise with the refreshed profile data
 */
export const refreshProfile = async (userId: string | number) => {
  if (!userId) return null;

  try {
    console.log('🔄 Refreshing profile for userId:', userId);
    const response = await getProfile(userId);
    
    if (response && response.success && response.data) {
      const profileData = response.data;
      
      // 1. Update Redux (this also triggers the userDataSlice sync to userDetails in memory)
      store.dispatch(setUserProfile(profileData));
      
      // 2. Persist the updated userDetails to Local Storage
      // We get the freshly updated state from Redux
      const updatedUserDetails = store.getState().userData.userDetails;
      
      console.log('💾 Persisting updated profile to Local Storage');
      await storeItemLS('userDetailsLS', updatedUserDetails);
      
      return profileData;
    }
    return null;
  } catch (error) {
    console.error('❌ Error refreshing profile:', error);
    return null;
  }
};
