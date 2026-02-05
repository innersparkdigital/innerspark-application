/**
 * Therapist Calendar & Availability API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get availability slots
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.date] - Specific date (YYYY-MM-DD)
 * @param {string} [filters.startDate] - Start date range (YYYY-MM-DD)
 * @param {string} [filters.endDate] - End date range (YYYY-MM-DD)
 * @param {'available'|'blocked'|'booked'} [filters.status] - Slot status
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Availability slots with pagination
 * @example
 * const result = await getAvailabilitySlots(therapistId, { date: '2025-10-24' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     slots: [{
 * //       id: "slot_001",
 * //       date: "2025-10-24",
 * //       startTime: "09:00",
 * //       endTime: "10:00",
 * //       status: "available",
 * //       recurring: false
 * //     }]
 * //   }
 * // }
 */
export const getAvailabilitySlots = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/availability', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Create availability slot
 * @param {Object} slotData - Slot details
 * @param {string} slotData.therapist_id - Therapist ID
 * @param {string} slotData.date - Slot date (YYYY-MM-DD)
 * @param {string} slotData.startTime - Start time (HH:MM)
 * @param {string} slotData.endTime - End time (HH:MM)
 * @param {boolean} [slotData.recurring=false] - Is recurring slot
 * @param {Object} [slotData.recurrencePattern] - Recurrence pattern (if recurring)
 * @param {'daily'|'weekly'|'monthly'} [slotData.recurrencePattern.type] - Recurrence type
 * @param {string} [slotData.recurrencePattern.endDate] - End date for recurrence
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created slot
 * @example
 * const result = await createAvailabilitySlot({
 *   therapist_id: therapistId,
 *   date: "2025-10-24",
 *   startTime: "09:00",
 *   endTime: "10:00",
 *   recurring: true,
 *   recurrencePattern: { type: "weekly", endDate: "2025-12-31" }
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Availability slot created successfully",
 * //   data: { slotId: "slot_001" }
 * // }
 */
export const createAvailabilitySlot = async (slotData) => {
    const response = await APIInstance.post('/th/availability', slotData);
    return response.data;
};

/**
 * Update availability slot
 * @param {string} slotId - Slot ID
 * @param {Object} updateData - Update details (same fields as createAvailabilitySlot)
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated slot
 */
export const updateAvailabilitySlot = async (slotId, updateData) => {
    const response = await APIInstance.put(`/th/availability/${slotId}`, updateData);
    return response.data;
};

/**
 * Delete availability slot
 * @param {string} slotId - Slot ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Deletion confirmation
 */
export const deleteAvailabilitySlot = async (slotId, therapistId) => {
    const response = await APIInstance.delete(`/th/availability/${slotId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Get booked slots
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.date] - Specific date (YYYY-MM-DD)
 * @param {string} [filters.startDate] - Start date range (YYYY-MM-DD)
 * @param {string} [filters.endDate] - End date range (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data: Object}>} Booked slots list
 * @example
 * const result = await getBookedSlots(therapistId, { date: '2025-10-24' });
 * // Returns list of booked time slots with appointment details
 */
export const getBookedSlots = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/availability/booked', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get weekly availability
 * @param {string} therapistId - Therapist ID
 * @param {string} weekStart - Week start date (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, data: Object}>} Weekly availability grid
 * @example
 * const result = await getWeeklyAvailability(therapistId, '2025-10-20');
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     weekStart: "2025-10-20",
 * //     weekEnd: "2025-10-26",
 * //     days: {
 * //       monday: [{ startTime: "09:00", endTime: "17:00", status: "available" }],
 * //       tuesday: [...],
 * //       ...
 * //     }
 * //   }
 * // }
 */
export const getWeeklyAvailability = async (therapistId, weekStart) => {
    const response = await APIInstance.get('/th/availability/weekly', {
        params: { therapist_id: therapistId, weekStart }
    });
    return response.data;
};

/**
 * Bulk update availability
 * @param {string} therapistId - Therapist ID
 * @param {Array<Object>} slots - Array of slot objects
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Bulk update confirmation
 * @example
 * const result = await bulkUpdateAvailability(therapistId, [
 *   { date: "2025-10-24", startTime: "09:00", endTime: "10:00" },
 *   { date: "2025-10-24", startTime: "10:00", endTime: "11:00" }
 * ]);
 * // Returns: { success: true, message: "...", data: { slotsCreated: 2 } }
 */
export const bulkUpdateAvailability = async (therapistId, slots) => {
    const response = await APIInstance.post('/th/availability/bulk', {
        therapist_id: therapistId,
        slots
    });
    return response.data;
};

/**
 * Block time slot
 * @param {string} therapistId - Therapist ID
 * @param {Object} slotData - Block details
 * @param {string} slotData.date - Date to block (YYYY-MM-DD)
 * @param {string} slotData.startTime - Start time (HH:MM)
 * @param {string} slotData.endTime - End time (HH:MM)
 * @param {string} [slotData.reason] - Reason for blocking
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Block confirmation
 * @example
 * const result = await blockTimeSlot(therapistId, {
 *   date: "2025-10-24",
 *   startTime: "14:00",
 *   endTime: "16:00",
 *   reason: "Personal time"
 * });
 * // Returns: { success: true, message: "...", data: { blockId: "block_001" } }
 */
export const blockTimeSlot = async (therapistId, slotData) => {
    const response = await APIInstance.post('/th/availability/block', {
        therapist_id: therapistId,
        ...slotData
    });
    return response.data;
};

/**
 * Unblock time slot
 * @param {string} slotId - Blocked slot ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Unblock confirmation
 */
export const unblockTimeSlot = async (slotId, therapistId) => {
    const response = await APIInstance.delete(`/th/availability/block/${slotId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
