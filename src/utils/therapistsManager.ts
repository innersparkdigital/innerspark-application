/**
 * Therapists Manager
 * Handles therapist API calls with graceful error handling
 * Returns empty arrays for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setTherapists,
  setSelectedTherapist,
  setLoading,
  setRefreshing,
  setError,
} from '../features/therapists/therapistsSlice';
import { getTherapists, getTherapistById } from '../api/client/therapists';

/**
 * Load therapists from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadTherapists = async (filters = {}) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('👨‍⚕️ Loading therapists from API with filters:', filters);
    const response = await getTherapists(filters);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      const therapists = response.data.therapists || [];
      console.log('📊 Therapists count:', therapists.length);
      
      store.dispatch(setTherapists(therapists));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setTherapists([]));
    }
  } catch (error: any) {
    console.log('❌ Error loading therapists:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    
    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/therapists endpoint returns 404, showing empty state');
      store.dispatch(setTherapists([]));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setTherapists([]));
      store.dispatch(setError(error?.message || 'Failed to load therapists'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh therapists list
 */
export const refreshTherapists = async (filters = {}) => {
  store.dispatch(setRefreshing(true));
  
  try {
    console.log('🔄 Refreshing therapists with filters:', filters);
    const response = await getTherapists(filters);
    
    if (response.success && response.data) {
      const therapists = response.data.therapists || [];
      store.dispatch(setTherapists(therapists));
    } else {
      store.dispatch(setTherapists([]));
    }
  } catch (error: any) {
    console.log('Error refreshing therapists:', error);
    
    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setTherapists([]));
    } else {
      store.dispatch(setTherapists([]));
      store.dispatch(setError(error?.message || 'Failed to refresh therapists'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Load therapist details by ID
 */
export const loadTherapistDetails = async (therapistId: string) => {
  try {
    console.log('👨‍⚕️ Loading therapist details for ID:', therapistId);
    const response = await getTherapistById(therapistId);
    
    if (response.success && response.data) {
      const therapist = response.data.therapist || null;
      console.log('✅ Therapist details loaded:', therapist?.name);
      
      store.dispatch(setSelectedTherapist(therapist));
      return { success: true, therapist };
    } else {
      console.log('⚠️ API response missing success or data:', response);
      return { success: false, error: 'Failed to load therapist details' };
    }
  } catch (error: any) {
    console.log('❌ Error loading therapist details:', error?.message);
    
    // Handle 404 - therapist not found or endpoint not implemented
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/therapists/:id endpoint returns 404');
      return { success: false, error: 'Therapist not found' };
    }
    
    return { success: false, error: error?.message || 'Failed to load therapist details' };
  }
};
