/**
 * Therapist Appointments Manager
 * Handles appointment API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import store from '../app/store';
import {
    updateAppointments,
    addAppointment,
    updateAppointment as updateAppointmentAction,
    removeAppointment as removeAppointmentAction,
    setSelectedAppointment,
    setAppointmentsLoading,
} from '../features/therapist/appointmentsSlice';
import {
    getAppointments,
    getAppointmentById,
    createAppointment as createAppointmentAPI,
    updateAppointment as updateAppointmentAPI,
    cancelAppointment,
    startSession,
} from '../api/therapist/appointments';

/**
 * Load appointments from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadAppointments = async (therapistId: string, filters: any = {}) => {
    store.dispatch(setAppointmentsLoading(true));

    try {
        console.log('📅 Loading therapist appointments from API with filters:', filters);
        const response = await getAppointments(therapistId, filters);
        console.log('✅ API Response:', JSON.stringify(response, null, 2));

        if (response.success && response.data) {
            const appointments = response.data.appointments || [];
            console.log('📊 Appointments count:', appointments.length);

            store.dispatch(updateAppointments(appointments));
            return { success: true, appointments };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            store.dispatch(updateAppointments([]));
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading appointments:', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
        });

        // Handle 404 - no data available, return empty state
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/appointments endpoint returns 404, showing empty state');
            store.dispatch(updateAppointments([]));
            return { success: false, error: 'No appointments available', isEmpty: true };
        }

        // Other errors - set empty data
        console.log('⚠️ Non-404 error, showing empty state');
        store.dispatch(updateAppointments([]));
        return { success: false, error: error?.message || 'Failed to load appointments' };
    } finally {
        store.dispatch(setAppointmentsLoading(false));
    }
};

/**
 * Load appointment details by ID
 */
export const loadAppointmentDetails = async (appointmentId: string, therapistId: string) => {
    try {
        console.log('📅 Loading appointment details for ID:', appointmentId);
        const response = await getAppointmentById(appointmentId, therapistId);

        if (response.success && response.data) {
            const appointment = response.data.appointment || response.data;
            console.log('✅ Appointment details loaded:', appointment.id);

            store.dispatch(setSelectedAppointment(appointment));
            return { success: true, appointment };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading appointment details:', error?.message);

        // Handle 404 - appointment not found or endpoint not implemented
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/appointments/:id endpoint returns 404');
            return { success: false, error: 'Appointment not found' };
        }

        return { success: false, error: error?.message || 'Failed to load appointment details' };
    }
};

/**
 * Create a new appointment
 */
export const createAppointment = async (appointmentData: any) => {
    try {
        console.log('📅 Creating new appointment:', appointmentData);
        const response = await createAppointmentAPI(appointmentData);

        if (response.success) {
            console.log('✅ Appointment created successfully:', response.data);

            // Add to Redux store
            if (response.data.appointment) {
                store.dispatch(addAppointment(response.data.appointment));
            }

            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to create appointment' };
        }
    } catch (error: any) {
        console.log('❌ Error creating appointment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create appointment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create appointment' };
    }
};

/**
 * Update an appointment
 */
export const updateAppointment = async (appointmentId: string, updateData: any) => {
    try {
        console.log('📅 Updating appointment:', appointmentId, updateData);
        const response = await updateAppointmentAPI(appointmentId, updateData);

        if (response.success) {
            console.log('✅ Appointment updated successfully');

            // Update in Redux store
            if (response.data.appointment) {
                store.dispatch(updateAppointmentAction(response.data.appointment));
            }

            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update appointment' };
        }
    } catch (error: any) {
        console.log('❌ Error updating appointment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update appointment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update appointment' };
    }
};

/**
 * Cancel an appointment
 */
export const cancelAppointmentById = async (appointmentId: string, therapistId: string) => {
    try {
        console.log('📅 Cancelling appointment:', appointmentId);
        const response = await cancelAppointment(appointmentId, therapistId);

        if (response.success) {
            console.log('✅ Appointment cancelled successfully');

            // Remove from Redux store
            store.dispatch(removeAppointmentAction(appointmentId));

            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to cancel appointment' };
        }
    } catch (error: any) {
        console.log('❌ Error cancelling appointment:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Cancel appointment endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to cancel appointment' };
    }
};

/**
 * Start a session
 */
export const startAppointmentSession = async (appointmentId: string, therapistId: string) => {
    try {
        console.log('📅 Starting session for appointment:', appointmentId);
        const response = await startSession(appointmentId, therapistId);

        if (response.success) {
            console.log('✅ Session started successfully');

            // Update appointment status in Redux
            if (response.data.appointment) {
                store.dispatch(updateAppointmentAction(response.data.appointment));
            }

            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to start session' };
        }
    } catch (error: any) {
        console.log('❌ Error starting session:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Start session endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to start session' };
    }
};
