/**
 * Therapist Calendar Manager
 * Handles calendar/availability API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import {
    getAvailabilitySlots,
    createAvailabilitySlot as createSlotAPI,
    updateAvailabilitySlot as updateSlotAPI,
    deleteAvailabilitySlot,
    getBookedSlots,
    getWeeklyAvailability,
    bulkUpdateAvailability as bulkUpdateAPI,
    blockTimeSlot as blockSlotAPI,
    unblockTimeSlot as unblockSlotAPI,
} from '../api/therapist/calendar';

/**
 * Load availability slots from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadAvailabilitySlots = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('📅 Loading availability slots with filters:', filters);
        const response = await getAvailabilitySlots(therapistId, filters);

        if (response.success && response.data) {
            const slots = response.data.slots || [];
            console.log('📊 Slots count:', slots.length);
            return { success: true, slots };
        } else {
            console.log('⚠️ API response missing success or data');
            return { success: false, error: 'Invalid response format', slots: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading availability slots:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/availability endpoint returns 404');
            return { success: false, error: 'No slots available', isEmpty: true, slots: [] };
        }

        return { success: false, error: error?.message || 'Failed to load slots', slots: [] };
    }
};

/**
 * Create availability slot
 */
export const createAvailabilitySlot = async (slotData: any) => {
    try {
        console.log('📅 Creating availability slot');
        const response = await createSlotAPI(slotData);

        if (response.success) {
            console.log('✅ Slot created successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to create slot' };
        }
    } catch (error: any) {
        console.log('❌ Error creating slot:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create slot endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create slot' };
    }
};

/**
 * Update availability slot
 */
export const updateAvailabilitySlot = async (slotId: string, updateData: any) => {
    try {
        console.log('📅 Updating availability slot:', slotId);
        const response = await updateSlotAPI(slotId, updateData);

        if (response.success) {
            console.log('✅ Slot updated successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update slot' };
        }
    } catch (error: any) {
        console.log('❌ Error updating slot:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update slot endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update slot' };
    }
};

/**
 * Delete availability slot
 */
export const deleteAvailabilitySlotById = async (slotId: string, therapistId: string) => {
    try {
        console.log('📅 Deleting availability slot:', slotId);
        const response = await deleteAvailabilitySlot(slotId, therapistId);

        if (response.success) {
            console.log('✅ Slot deleted successfully');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to delete slot' };
        }
    } catch (error: any) {
        console.log('❌ Error deleting slot:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Delete slot endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to delete slot' };
    }
};

/**
 * Load booked slots
 */
export const loadBookedSlots = async (therapistId: string, filters: any = {}) => {
    try {
        console.log('📅 Loading booked slots');
        const response = await getBookedSlots(therapistId, filters);

        if (response.success && response.data) {
            const bookedSlots = response.data.bookedSlots || [];
            return { success: true, bookedSlots };
        } else {
            return { success: false, error: 'Invalid response format', bookedSlots: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading booked slots:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'No booked slots available', isEmpty: true, bookedSlots: [] };
        }

        return { success: false, error: error?.message || 'Failed to load booked slots', bookedSlots: [] };
    }
};

/**
 * Load weekly availability
 */
export const loadWeeklyAvailability = async (therapistId: string, weekStart: string) => {
    try {
        console.log('📅 Loading weekly availability for week:', weekStart);
        const response = await getWeeklyAvailability(therapistId, weekStart);

        if (response.success && response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading weekly availability:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Weekly availability not available', isEmpty: true };
        }

        return { success: false, error: error?.message || 'Failed to load weekly availability' };
    }
};

/**
 * Bulk update availability
 */
export const bulkUpdateAvailability = async (therapistId: string, slots: any[]) => {
    try {
        console.log('📅 Bulk updating availability with', slots.length, 'slots');
        const response = await bulkUpdateAPI(therapistId, slots);

        if (response.success) {
            console.log('✅ Bulk update successful');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to bulk update' };
        }
    } catch (error: any) {
        console.log('❌ Error bulk updating:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Bulk update endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to bulk update' };
    }
};

/**
 * Block time slot
 */
export const blockTimeSlot = async (therapistId: string, slotData: any) => {
    try {
        console.log('🚫 Blocking time slot');
        const response = await blockSlotAPI(therapistId, slotData);

        if (response.success) {
            console.log('✅ Time slot blocked');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to block time slot' };
        }
    } catch (error: any) {
        console.log('❌ Error blocking time slot:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Block time slot endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to block time slot' };
    }
};

/**
 * Unblock time slot
 */
export const unblockTimeSlot = async (slotId: string, therapistId: string) => {
    try {
        console.log('✅ Unblocking time slot:', slotId);
        const response = await unblockSlotAPI(slotId, therapistId);

        if (response.success) {
            console.log('✅ Time slot unblocked');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to unblock time slot' };
        }
    } catch (error: any) {
        console.log('❌ Error unblocking time slot:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Unblock time slot endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to unblock time slot' };
    }
};
