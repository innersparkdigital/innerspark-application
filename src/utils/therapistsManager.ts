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
import { FALLBACK_IMAGES } from './imageHelpers';

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

    if ((response.success || response.status === 'success') && response.data) {
      const rawTherapists = Array.isArray(response.data) ? response.data : (response.data.therapists || []);

      const mappedTherapists = rawTherapists.map((t: any) => ({
        id: t.user_id || t.id,
        name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Therapist',
        specialty: t.specialities || t.specialty || 'Therapist',
        rating: t.rating || 5,
        location: t.location || 'Online',
        image: t.image ? { uri: t.image } : FALLBACK_IMAGES.avatar,
        reviews: t.reviews ? parseInt(t.reviews) : 0,
        experience: t.experience ? (t.experience.toString().includes('year') ? t.experience : `${t.experience} years`) : '5+ years',
        price: t.price || 'UGX 50,000',
        priceUnit: t.priceUnit || '/session',
        available: t.availability === 1 || t.available === true || t.availability === "1",
        bio: t.bio || '',
        nextAvailable: t.nextAvailable || 'Today',
      }));

      console.log('📊 Therapists count:', mappedTherapists.length);
      store.dispatch(setTherapists(mappedTherapists));
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

    if ((response.success || response.status === 'success') && response.data) {
      const rawTherapists = Array.isArray(response.data) ? response.data : (response.data.therapists || []);
      const mappedTherapists = rawTherapists.map((t: any) => ({
        id: t.user_id || t.id,
        name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Therapist',
        specialty: t.specialities || t.specialty || 'Therapist',
        rating: t.rating || 5,
        location: t.location || 'Online',
        image: t.image ? { uri: t.image } : FALLBACK_IMAGES.avatar,
        reviews: t.reviews ? parseInt(t.reviews) : 0,
        experience: t.experience ? (t.experience.toString().includes('year') ? t.experience : `${t.experience} years`) : '5+ years',
        price: t.price || 'UGX 50,000',
        priceUnit: t.priceUnit || '/session',
        available: t.availability === 1 || t.available === true || t.availability === "1",
        bio: t.bio || '',
        nextAvailable: t.nextAvailable || 'Today',
      }));
      store.dispatch(setTherapists(mappedTherapists));
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
