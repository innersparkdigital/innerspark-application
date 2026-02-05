/**
 * Therapist Appointments API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapist appointments
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'all'|'today'|'upcoming'|'completed'} [filters.filter] - Appointment filter
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Appointments list with pagination
 * @example
 * const result = await getAppointments(therapistId, { filter: 'today', page: 1, limit: 10 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     appointments: [{
 * //       id: "apt_001",
 * //       clientId: "client_123",
 * //       clientName: "John Doe",
 * //       clientAvatar: "👨",
 * //       type: "Individual Session",
 * //       date: "2025-10-24",
 * //       time: "10:00",
 * //       duration: 60,
 * //       status: "upcoming",
 * //       meetingLink: "https://meet.innerspark.com/room/123",
 * //       notes: "Client requested to discuss anxiety management"
 * //     }],
 * //     pagination: { currentPage: 1, totalPages: 5, totalItems: 96 }
 * //   }
 * // }
 */
export const getAppointments = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/appointments', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get appointment details by ID
 * @param {string} appointmentId - Appointment ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Appointment details with client info
 * @example
 * const result = await getAppointmentById(appointmentId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     id: "apt_001",
 * //     client: {
 * //       id: "client_123",
 * //       name: "John Doe",
 * //       avatar: "👨",
 * //       email: "john@example.com",
 * //       phoneNumber: "+256784740145",
 * //       totalSessions: 3,
 * //       rating: 4.8
 * //     },
 * //     appointment: {
 * //       type: "Individual Session",
 * //       date: "2025-10-24",
 * //       time: "10:00",
 * //       duration: 60,
 * //       status: "upcoming",
 * //       meetingLink: "https://meet.innerspark.com/room/123"
 * //     },
 * //     notes: "Client requested to discuss anxiety management techniques"
 * //   }
 * // }
 */
export const getAppointmentById = async (appointmentId, therapistId) => {
    const response = await APIInstance.get(`/th/appointments/${appointmentId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Create new appointment
 * @param {Object} appointmentData - Appointment details
 * @param {string} appointmentData.therapist_id - Therapist ID
 * @param {string} appointmentData.clientId - Client ID
 * @param {string} appointmentData.type - Session type (e.g., "Individual Session")
 * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
 * @param {string} appointmentData.time - Appointment time (HH:MM)
 * @param {number} appointmentData.duration - Duration in minutes
 * @param {string} [appointmentData.notes] - Optional notes
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created appointment
 * @example
 * const result = await createAppointment({
 *   therapist_id: therapistId,
 *   clientId: "client_123",
 *   type: "Individual Session",
 *   date: "2025-10-24",
 *   time: "10:00",
 *   duration: 60,
 *   notes: "Initial consultation"
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Appointment scheduled successfully",
 * //   data: {
 * //     appointmentId: "apt_001",
 * //     meetingLink: "https://meet.innerspark.com/room/123"
 * //   }
 * // }
 */
export const createAppointment = async (appointmentData) => {
    const response = await APIInstance.post('/th/appointments', appointmentData);
    return response.data;
};

/**
 * Update appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} updateData - Update details
 * @param {string} updateData.therapist_id - Therapist ID
 * @param {string} [updateData.date] - New date (YYYY-MM-DD)
 * @param {string} [updateData.time] - New time (HH:MM)
 * @param {string} [updateData.notes] - Updated notes
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated appointment
 * @example
 * const result = await updateAppointment(appointmentId, {
 *   therapist_id: therapistId,
 *   date: "2025-10-25",
 *   time: "14:00",
 *   notes: "Rescheduled at client's request"
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Appointment updated successfully",
 * //   data: {
 * //     appointmentId: "apt_001",
 * //     updatedAt: "2025-10-23T16:00:00Z"
 * //   }
 * // }
 */
export const updateAppointment = async (appointmentId, updateData) => {
    const response = await APIInstance.put(`/th/appointments/${appointmentId}`, updateData);
    return response.data;
};

/**
 * Cancel appointment
 * @param {string} appointmentId - Appointment ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Cancellation confirmation
 * @example
 * const result = await cancelAppointment(appointmentId, therapistId);
 * // Returns: { success: true, message: "Appointment cancelled successfully" }
 */
export const cancelAppointment = async (appointmentId, therapistId) => {
    const response = await APIInstance.delete(`/th/appointments/${appointmentId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Start appointment session
 * @param {string} appointmentId - Appointment ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Session start confirmation with session details
 * @example
 * const result = await startAppointmentSession(appointmentId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Session started",
 * //   data: {
 * //     sessionId: "session_001",
 * //     startTime: "2025-10-24T10:00:00Z",
 * //     clientId: "client_123",
 * //     duration: 60
 * //   }
 * // }
 */
export const startAppointmentSession = async (appointmentId, therapistId) => {
    const response = await APIInstance.post(`/th/appointments/${appointmentId}/start`, {
        therapist_id: therapistId
    });
    return response.data;
};
