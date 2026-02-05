/**
 * Therapist Clients API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapist's client list
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.search] - Search by name
 * @param {'active'|'inactive'} [filters.status] - Client status filter
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Clients list with pagination
 * @example
 * const result = await getClients(therapistId, { search: 'John', status: 'active', page: 1 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     clients: [{
 * //       id: "client_123",
 * //       name: "John Doe",
 * //       avatar: "👨",
 * //       email: "john@example.com",
 * //       status: "active",
 * //       totalSessions: 12,
 * //       lastSession: "2025-10-20",
 * //       nextAppointment: "2025-10-24T10:00:00Z"
 * //     }],
 * //     pagination: { currentPage: 1, totalPages: 3, totalItems: 45 }
 * //   }
 * // }
 */
export const getClients = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/clients', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get client profile details
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Client profile with therapy history and notes
 * @example
 * const result = await getClientProfile(clientId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     id: "client_123",
 * //     name: "John Doe",
 * //     avatar: "👨",
 * //     email: "john@example.com",
 * //     phoneNumber: "+256784740145",
 * //     dateOfBirth: "1990-05-15",
 * //     gender: "Male",
 * //     joinedDate: "2024-12-01",
 * //     status: "active",
 * //     stats: {
 * //       totalSessions: 12,
 * //       completedSessions: 10,
 * //       cancelledSessions: 2,
 * //       lastSession: "2025-10-20",
 * //       nextAppointment: "2025-10-24T10:00:00Z"
 * //     },
 * //     notes: [{ id: "note_001", title: "Session Summary", date: "2025-10-20", type: "session" }]
 * //   }
 * // }
 */
export const getClientProfile = async (clientId, therapistId) => {
    const response = await APIInstance.get(`/th/clients/${clientId}/profile`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
