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
} from '../features/appointments/appointmentsSlice';
import {
  getAppointments,
  getAppointmentById,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  submitAppointmentReview,
} from '../api/client/appointments';

/**
 * Load appointments from API
 * Returns empty array if endpoint not implemented (404)
 */
export const loadAppointments = async (filters = {}) => {
  store.dispatch(setLoading(true));
  
  try {
    console.log('📅 Loading appointments from API with filters:', filters);
    const response = await getAppointments(filters);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      const appointments = response.data.appointments || [];
      console.log('📊 Appointments count:', appointments.length);
      
      store.dispatch(setAppointments(appointments));
    } else {
      console.log('⚠️ API response missing success or data:', response);
      store.dispatch(setAppointments([]));
    }
  } catch (error: any) {
    console.log('❌ Error loading appointments:', {
      message: error?.message,
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
      store.dispatch(setError(error?.message || 'Failed to load appointments'));
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
  
  try {
    console.log('🔄 Refreshing appointments with filters:', filters);
    const response = await getAppointments(filters);
    
    if (response.success && response.data) {
      const appointments = response.data.appointments || [];
      store.dispatch(setAppointments(appointments));
    } else {
      store.dispatch(setAppointments([]));
    }
  } catch (error: any) {
    console.log('Error refreshing appointments:', error);
    
    // Handle 404 gracefully - show empty state
    if (error?.response?.status === 404) {
      store.dispatch(setAppointments([]));
    } else {
      store.dispatch(setAppointments([]));
      store.dispatch(setError(error?.message || 'Failed to refresh appointments'));
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
      const appointment = response.data.appointment || response.data;
      console.log('✅ Appointment details loaded:', appointment.id);
      
      store.dispatch(setSelectedAppointment(appointment));
      return { success: true, appointment };
    } else {
      console.log('⚠️ API response missing success or data:', response);
      return { success: false, error: 'Failed to load appointment details' };
    }
  } catch (error: any) {
    console.log('❌ Error loading appointment details:', error?.message);
    
    // Handle 404 - appointment not found or endpoint not implemented
    if (error?.response?.status === 404) {
      console.log('📦 GET /client/appointments/:id endpoint returns 404');
      return { success: false, error: 'Appointment not found' };
    }
    
    return { success: false, error: error?.message || 'Failed to load appointment details' };
  }
};

/**
 * Book a new appointment
 */
export const createAppointment = async (appointmentData: any) => {
  try {
    console.log('📅 Booking new appointment:', appointmentData);
    const response = await bookAppointment(appointmentData);
    
    if (response.success) {
      console.log('✅ Appointment booked successfully:', response.data);
      // Refresh appointments list
      await loadAppointments();
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.message || 'Failed to book appointment' };
    }
  } catch (error: any) {
    console.log('❌ Error booking appointment:', error?.message);
    return { success: false, error: error?.message || 'Failed to book appointment' };
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
    console.log('❌ Error rescheduling appointment:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Reschedule endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to reschedule appointment' };
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
    console.log('❌ Error cancelling appointment:', error?.message);
    return { success: false, error: error?.message || 'Failed to cancel appointment' };
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
    console.log('❌ Error submitting review:', error?.message);
    
    if (error?.response?.status === 404) {
      return { success: false, error: 'Review endpoint not implemented yet' };
    }
    
    return { success: false, error: error?.message || 'Failed to submit review' };
  }
};
