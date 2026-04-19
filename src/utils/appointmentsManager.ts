/**
 * Appointments Manager
 * Handles appointment API calls with graceful error handling
 * Returns empty arrays for 404 (endpoint not implemented yet)
 */
import store from '../app/store';
import {
  setAppointments,
  setSelectedAppointment,
  setLoading,
  setRefreshing,
  setError,
  updateAppointmentStatus,
  removeAppointment,
  setSessionTypes,
} from '../features/appointments/appointmentsSlice';
import {
  getAppointments,
  getAppointmentById,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  submitAppointmentReview,
} from '../api/client/appointments';
import { getSessionsPricing } from '../api/client/therapists';

/**
 * Helper to map backend appointment to UI format
 */
const mapAppointment = (apt: any) => ({
  id: apt.id || apt.appointmentId,
  appointmentId: apt.appointmentId || apt.id,
  date: apt.date,
  time: apt.time,
  duration: apt.duration || 60,
  therapistId: apt.therapistId,
  therapistName: apt.therapistName || 'Therapist',
  therapistAvatar: apt.therapistAvatar || null,
  status: apt.status || 'upcoming',
  sessionType: apt.sessionType || 'individual',
  price: apt.price || 0,
  currency: apt.currency || 'UGX',
  isPaid: apt.isPaid === true || apt.isPaid === 'true',
  meetingLink: apt.meetingLink || null,
  location: apt.location || 'Virtual Session',
  reason: apt.reason || '',
});

/**
 * Load appointments from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadAppointments = async (filters = {}) => {
  store.dispatch(setLoading(true));

  const state = store.getState() as any;
  const userId = state.userData?.userDetails?.userId || state.user?.userToken?.userId;

  try {
    const finalFilters: any = { ...filters };
    if (userId && !finalFilters.user_id) {
      finalFilters.user_id = userId;
    }

    console.log('📅 Loading appointments from API with filters:', finalFilters);
    const response = await getAppointments(finalFilters);
    console.log('✅ API Response Success:', response.success);
    if (response.data && response.data.appointments) {
      console.log('✅ API Appointments Count:', response.data.appointments.length);
      console.log('✅ First Appointment Sample:', JSON.stringify(response.data.appointments[0], null, 2));
    }

    if (response.success && response.data) {
      const rawAppointments = response.data.appointments || [];
      console.log('📊 Appointments count:', rawAppointments.length);

      const mappedAppointments = rawAppointments.map(mapAppointment);

      store.dispatch(setAppointments(mappedAppointments));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setAppointments([]));
    }
  } catch (error: any) {
    console.log('❌ Error loading appointments:', {
      message: error?.backendMessage || error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Handle 404 - endpoint not implemented yet, return empty state
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/appointments endpoint returns 404, showing empty state');
      store.dispatch(setAppointments([]));
    } else {
      // Other errors - set error state with empty data
      console.log('⚠️ Non-404 error, showing empty state');
      store.dispatch(setAppointments([]));
      store.dispatch(setError(error?.backendMessage || error?.message || 'Failed to load appointments'));
    }
  } finally {
    store.dispatch(setLoading(false));
  }
};

/**
 * Refresh appointments list
 */
export const refreshAppointments = async (filters = {}) => {
  store.dispatch(setRefreshing(true));

  const state = store.getState() as any;
  const userId = state.userData?.userDetails?.userId || state.user?.userToken?.userId;

  try {
    const finalFilters: any = { ...filters };
    if (userId && !finalFilters.user_id) {
      finalFilters.user_id = userId;
    }

    console.log('🔄 Refreshing appointments with filters:', finalFilters);
    const response = await getAppointments(finalFilters);

    if (response.success && response.data) {
      const rawAppointments = response.data.appointments || [];
      const mappedAppointments = rawAppointments.map(mapAppointment);
      store.dispatch(setAppointments(mappedAppointments));
    } else {
      store.dispatch(setAppointments([]));
    }
  } catch (error: any) {
    console.log('Error refreshing appointments:', error?.backendMessage || error?.message);

    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setAppointments([]));
    } else {
      store.dispatch(setAppointments([]));
      store.dispatch(setError(error?.backendMessage || error?.message || 'Failed to refresh appointments'));
    }
  } finally {
    store.dispatch(setRefreshing(false));
  }
};

/**
 * Load appointment details by ID
 */
export const loadAppointmentDetails = async (appointmentId: string) => {
  try {
    console.log('📅 Loading appointment details for ID:', appointmentId);
    const response = await getAppointmentById(appointmentId);

    if (response.success && response.data) {
      const rawAppointment = response.data.appointment || response.data;
      const appointment = mapAppointment(rawAppointment);
      console.log('✅ Appointment details loaded:', appointment.id);

      store.dispatch(setSelectedAppointment(appointment));
      return { success: true, appointment };
    } else {
      console.log('⚠️ API response missing success or data:', response);
      return { success: false, error: 'Failed to load appointment details' };
    }
  } catch (error: any) {
    console.log('❌ Error loading appointment details:', error?.backendMessage || error?.message);

    // Handle 404 - appointment not found or endpoint not implemented
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/appointments/:id endpoint returns 404');
      return { success: false, error: 'Appointment not found' };
    }

    return { success: false, error: error?.backendMessage || error?.message || 'Failed to load appointment details' };
  }
};

/**
 * Book a new appointment
 */
export const createAppointment = async (appointmentData: any) => {
  const state = store.getState() as any;
  const userId = state.userData?.userDetails?.userId || state.user?.userToken?.userId;

  try {
    const finalData: any = { ...appointmentData };
    if (userId) {
      finalData.user_id = userId;
    }

    console.log('📅 Booking new appointment:', finalData);
    const response = await bookAppointment(finalData);

    if (response.success && response.data) {
      console.log('✅ Appointment booked successfully:', response.data);

      const newAppointment = {
        id: response.data.appointmentId || response.data.id,
        date: response.data.date,
        time: response.data.time,
        meetingLink: response.data.meetingLink,
        therapistName: response.data.therapistName,
        payment: response.data.payment,
        status: 'upcoming',
      };

      // Refresh appointments list
      await loadAppointments();
      return { success: true, data: newAppointment };
    } else {
      return { success: false, error: response.message || 'Failed to book appointment' };
    }
  } catch (error: any) {
    console.log('❌ Error booking appointment:', error?.backendMessage || error?.message);
    return { success: false, error: error?.backendMessage || error?.message || 'Failed to book appointment' };
  }
};

/**
 * Reschedule an appointment
 */
export const rescheduleAppointmentById = async (appointmentId: string, rescheduleData: any) => {
  try {
    console.log('📅 Rescheduling appointment:', appointmentId, rescheduleData);
    const response = await rescheduleAppointment(appointmentId, rescheduleData);

    if (response.success) {
      console.log('✅ Appointment rescheduled successfully');
      // Refresh appointments list
      await loadAppointments();
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to reschedule appointment' };
    }
  } catch (error: any) {
    console.log('❌ Error rescheduling appointment:', error?.backendMessage || error?.message);

    if (error?.response?.status === 404) {
      return { success: false, error: 'Reschedule endpoint not implemented yet' };
    }

    return { success: false, error: error?.backendMessage || error?.message || 'Failed to reschedule appointment' };
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointmentById = async (appointmentId: string, cancelData: any) => {
  try {
    console.log('📅 Cancelling appointment:', appointmentId, cancelData);
    const response = await cancelAppointment(appointmentId, cancelData);

    if (response.success) {
      console.log('✅ Appointment cancelled successfully');
      // Update appointment status in Redux
      store.dispatch(updateAppointmentStatus({ appointmentId, status: 'cancelled' }));
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to cancel appointment' };
    }
  } catch (error: any) {
    console.log('❌ Error cancelling appointment:', error?.backendMessage || error?.message);
    return { success: false, error: error?.backendMessage || error?.message || 'Failed to cancel appointment' };
  }
};

/**
 * Submit appointment review/feedback
 */
export const submitReview = async (appointmentId: string, reviewData: any) => {
  try {
    console.log('📅 Submitting review for appointment:', appointmentId);
    const response = await submitAppointmentReview(appointmentId, reviewData);

    if (response.success) {
      console.log('✅ Review submitted successfully');
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to submit review' };
    }
  } catch (error: any) {
    console.log('❌ Error submitting review:', error?.backendMessage || error?.message);

    if (error?.response?.status === 404) {
      return { success: false, error: 'Review endpoint not implemented yet' };
    }

    return { success: false, error: error?.backendMessage || error?.message || 'Failed to submit review' };
  }
};

/**
 * Load dynamic session types/pricing from backend
 */
export const loadSessionTypes = async () => {
  try {
    console.log('📅 Loading dynamic session types...');
    const response = await getSessionsPricing();
    
    if (response.success && response.data && response.data.sessionTypes) {
      console.log('✅ Session types loaded:', response.data.sessionTypes.length);
      store.dispatch(setSessionTypes(response.data.sessionTypes));
      return { success: true, data: response.data.sessionTypes };
    }
    return { success: false, error: 'Failed to load session types' };
  } catch (error: any) {
    console.log('❌ Error loading session types:', error?.message);
    return { success: false, error: error?.message || 'Failed to load session types' };
  }
};
