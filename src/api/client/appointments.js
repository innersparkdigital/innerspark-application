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
 * Cancel appointment
 * @param {string} appointmentId - Appointment ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} Success message
 */
export const cancelAppointment = async (appointmentId, reason) => {
    const response = await APIInstance.post(`/client/appointments/${appointmentId}/cancel`, {
        reason
    });
    return response.data;
};
