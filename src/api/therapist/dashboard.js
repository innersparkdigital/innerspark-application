/**
 * Therapist Dashboard API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get dashboard statistics
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Dashboard stats including appointments, requests, groups, messages, and clients
 * @example
 * const stats = await getDashboardStats(therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     appointments: { today: 5, thisWeek: 24, thisMonth: 96, upcoming: 12 },
 * //     requests: { pending: 3, new: 2 },
 * //     groups: { active: 4, totalMembers: 55, scheduled: 2 },
 * //     messages: { unread: 7, total: 145 },
 * //     clients: { total: 45, active: 38 },
 * //     sessionsToday: 8
 * //   }
 * // }
 */
export const getDashboardStats = async (therapistId) => {
    const response = await APIInstance.get('/th/dashboard/stats', {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Get therapist profile
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Complete therapist profile with professional details and statistics
 * @example
 * const profile = await getTherapistProfile(therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     id: string,
 * //     firstName: string,
 * //     lastName: string,
 * //     email: string,
 * //     phoneNumber: string,
 * //     specialization: string,
 * //     licenseNumber: string,
 * //     yearsOfExperience: number,
 * //     rating: number,
 * //     totalSessions: number,
 * //     profileImage: string (URL),
 * //     bio: string,
 * //     availability: { monday: ["09:00-17:00"], tuesday: [...], ... }
 * //   }
 * // }
 */
export const getTherapistProfile = async (therapistId) => {
    const response = await APIInstance.get('/th/profile', {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Update therapist profile
 * @param {string} therapistId - Therapist ID
 * @param {Object} updateData - Profile data to update
 * @returns {Promise<{success: boolean, data: Object}>} Updated profile
 * @example
 * const result = await updateTherapistProfile(therapistId, {
 *   sessionDuration: 60,
 *   breakDuration: 15,
 *   acceptingNewClients: true
 * });
 */
export const updateTherapistProfile = async (therapistId, updateData) => {
    const response = await APIInstance.put('/th/profile', updateData, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
