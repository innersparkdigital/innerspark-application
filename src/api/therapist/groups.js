/**
 * Therapist Support Groups API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get therapist's groups list
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'active'|'scheduled'|'archived'} [filters.status] - Group status filter
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Groups list with stats
 * @example
 * const result = await getGroups(therapistId, { status: 'active' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     groups: [{
 * //       id: "group_001",
 * //       name: "Anxiety Support Circle",
 * //       description: "A safe space for managing anxiety",
 * //       icon: "🧘",
 * //       members: 12,
 * //       maxMembers: 20,
 * //       status: "active",
 * //       nextSession: { date: "2025-10-24", time: "15:00", topic: "Breathing Techniques" }
 * //     }],
 * //     stats: { activeGroups: 4, totalMembers: 55 }
 * //   }
 * // }
 */
export const getGroups = async (therapistId, filters = {}) => {
    const response = await APIInstance.get('/th/groups', {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get group details by ID
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Group details with members, sessions, and statistics
 * @example
 * const result = await getGroupById(groupId, therapistId);
 * // Returns full group details including members array, session schedule, stats, and guidelines
 */
export const getGroupById = async (groupId, therapistId) => {
    const response = await APIInstance.get(`/th/groups/${groupId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Create new support group
 * @param {Object} groupData - Group details
 * @param {string} groupData.therapist_id - Therapist ID
 * @param {string} groupData.name - Group name
 * @param {string} groupData.description - Group description
 * @param {string} [groupData.icon='🧘'] - Group icon emoji
 * @param {number} groupData.maxMembers - Maximum members (min 1, max 100)
 * @param {'public'|'private'} [groupData.privacy='private'] - Privacy setting
 * @param {boolean} [groupData.requireApproval=true] - Require approval to join
 * @param {Array<string>} [groupData.guidelines] - Group guidelines
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created group
 * @example
 * const result = await createGroup({
 *   therapist_id: therapistId,
 *   name: "Anxiety Support Circle",
 *   description: "A safe space for managing anxiety",
 *   icon: "🧘",
 *   maxMembers: 20,
 *   privacy: "private",
 *   requireApproval: true,
 *   guidelines: ["Maintain confidentiality", "Respect others"]
 * });
 * // Returns: { success: true, message: "...", data: { groupId: "group_001" } }
 */
export const createGroup = async (groupData) => {
    const response = await APIInstance.post('/th/groups', groupData);
    return response.data;
};

/**
 * Update group
 * @param {string} groupId - Group ID
 * @param {Object} updateData - Update details (same fields as createGroup)
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated group
 */
export const updateGroup = async (groupId, updateData) => {
    const response = await APIInstance.put(`/th/groups/${groupId}`, updateData);
    return response.data;
};

/**
 * Archive group
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Archive confirmation
 */
export const archiveGroup = async (groupId, therapistId) => {
    const response = await APIInstance.delete(`/th/groups/${groupId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Get group messages
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @param {number} [page=1] - Page number
 * @param {number} [limit=50] - Messages per page
 * @returns {Promise<{success: boolean, data: Object}>} Group messages
 * @example
 * const result = await getGroupMessages(groupId, therapistId, 1, 50);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     messages: [{
 * //       id: "gmsg_001",
 * //       senderId: "therapist_123",
 * //       senderName: "Dr. John",
 * //       senderRole: "therapist",
 * //       content: "Welcome everyone to today's session",
 * //       type: "announcement" | "text",
 * //       timestamp: "2025-10-23T15:00:00Z"
 * //     }]
 * //   }
 * // }
 */
export const getGroupMessages = async (groupId, therapistId, page = 1, limit = 50) => {
    const response = await APIInstance.get(`/th/groups/${groupId}/messages`, {
        params: { therapist_id: therapistId, page, limit }
    });
    return response.data;
};

/**
 * Send group message
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @param {string} content - Message content
 * @returns {Promise<{success: boolean, data: Object}>} Sent message
 */
export const sendGroupMessage = async (groupId, therapistId, content) => {
    const response = await APIInstance.post(`/th/groups/${groupId}/messages`, {
        therapist_id: therapistId,
        content
    });
    return response.data;
};

/**
 * Send group announcement
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @param {string} content - Announcement content
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Sent announcement
 * @example
 * const result = await sendAnnouncement(groupId, therapistId, "Session starts in 10 minutes!");
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Announcement sent successfully",
 * //   data: {
 * //     messageId: "gmsg_004",
 * //     type: "announcement",
 * //     timestamp: "2025-10-23T16:00:00Z"
 * //   }
 * // }
 */
export const sendAnnouncement = async (groupId, therapistId, content) => {
    const response = await APIInstance.post(`/th/groups/${groupId}/announcements`, {
        therapist_id: therapistId,
        content
    });
    return response.data;
};

/**
 * Delete group message (moderation)
 * @param {string} groupId - Group ID
 * @param {string} messageId - Message ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Deletion confirmation
 */
export const deleteGroupMessage = async (groupId, messageId, therapistId) => {
    const response = await APIInstance.delete(`/th/groups/${groupId}/messages/${messageId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
