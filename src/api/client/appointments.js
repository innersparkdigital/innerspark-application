/**
 * Client Appointments API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get user appointments
 * @param {Object} filters - { status, date }
 * @returns {Promise} Appointments list
 */
export const getAppointments = async (filters = {}) => {
    const response = await APIInstance.get('/client/appointments', {
        params: filters
    });
    return response.data;
};

/**
 * Book new appointment
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise} Created appointment
 */
export const bookAppointment = async (appointmentData) => {
    const response = await APIInstance.post('/client/appointments', appointmentData);
    return response.data;
};

/**
 * Get appointment by ID
 * NOTE: Backend may not have implemented this endpoint yet
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise} Appointment details
 */
export const getAppointmentById = async (appointmentId) => {
    const response = await APIInstance.get(`/client/appointments/${appointmentId}`);
    return response.data;
};

/**
 * Reschedule appointment
 * NOTE: Backend may not have implemented this endpoint yet
 * @param {string} appointmentId - Appointment ID
 * @param {Object} rescheduleData - { newSlotId, newDate, newTime, reason }
 * @returns {Promise} Updated appointment
 */
export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
    const response = await APIInstance.put(`/client/appointments/${appointmentId}/reschedule`, rescheduleData);
    return response.data;
};

/**
 * Cancel appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} cancelData - { reason, requestRefund }
 * @returns {Promise} Success message with refund info
 */
export const cancelAppointment = async (appointmentId, cancelData) => {
    const response = await APIInstance.delete(`/client/appointments/${appointmentId}`, {
        data: cancelData
    });
    return response.data;
};

/**
 * Submit appointment review/feedback
 * NOTE: Backend may not have implemented this endpoint yet
 * @param {string} appointmentId - Appointment ID
 * @param {Object} reviewData - { rating, comment, tags }
 * @returns {Promise} Review submission result
 */
export const submitAppointmentReview = async (appointmentId, reviewData) => {
    const response = await APIInstance.post(`/client/appointments/${appointmentId}/review`, reviewData);
    return response.data;
};
