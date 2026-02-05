/**
 * Therapist Group Members API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get group members list
 * @param {string} groupId - Group ID
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {'all'|'active'|'inactive'|'muted'} [filters.filter='all'] - Member status filter
 * @param {string} [filters.search] - Search by name
 * @returns {Promise<{success: boolean, data: Object}>} Group members list
 * @example
 * const result = await getGroupMembers(groupId, therapistId, { filter: 'active' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     members: [{
 * //       id: "member_001",
 * //       userId: "user_123",
 * //       name: "John Doe",
 * //       avatar: "👨",
 * //       role: "member",
 * //       status: "active",
 * //       joinedDate: "2025-01-15",
 * //       attendance: "90%",
 * //       lastActive: "2 min ago"
 * //     }]
 * //   }
 * // }
 */
export const getGroupMembers = async (groupId, therapistId, filters = {}) => {
    const response = await APIInstance.get(`/th/groups/${groupId}/members`, {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get member profile (group context only)
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Member profile with group-specific stats
 * @example
 * const result = await getGroupMemberProfile(groupId, memberId, therapistId);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     id: "member_001",
 * //     name: "John Doe",
 * //     avatar: "👨",
 * //     role: "member",
 * //     status: "active",
 * //     joinedDate: "Jan 2025",
 * //     attendance: "90%",
 * //     lastActive: "2 min ago",
 * //     stats: {
 * //       sessionsAttended: 10,
 * //       totalSessions: 12,
 * //       messagesCount: 45
 * //     }
 * //   }
 * // }
 */
export const getGroupMemberProfile = async (groupId, memberId, therapistId) => {
    const response = await APIInstance.get(`/th/groups/${groupId}/members/${memberId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Update member role
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {string} therapistId - Therapist ID
 * @param {'member'|'moderator'} role - New role
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated member role
 * @example
 * const result = await updateMemberRole(groupId, memberId, therapistId, 'moderator');
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Member role updated successfully",
 * //   data: { memberId: "member_001", newRole: "moderator" }
 * // }
 */
export const updateMemberRole = async (groupId, memberId, therapistId, role) => {
    const response = await APIInstance.put(`/th/groups/${groupId}/members/${memberId}/role`, {
        therapist_id: therapistId,
        role
    });
    return response.data;
};

/**
 * Mute member
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {string} therapistId - Therapist ID
 * @param {number} duration - Mute duration in seconds
 * @returns {Promise<{success: boolean, message: string}>} Mute confirmation
 * @example
 * const result = await muteMember(groupId, memberId, therapistId, 300); // 5 minutes
 * // Returns: { success: true, message: "Member muted for 5 minutes" }
 */
export const muteMember = async (groupId, memberId, therapistId, duration) => {
    const response = await APIInstance.post(`/th/groups/${groupId}/members/${memberId}/mute`, {
        therapist_id: therapistId,
        duration
    });
    return response.data;
};

/**
 * Unmute member
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Unmute confirmation
 * @example
 * const result = await unmuteMember(groupId, memberId, therapistId);
 * // Returns: { success: true, message: "Member unmuted successfully" }
 */
export const unmuteMember = async (groupId, memberId, therapistId) => {
    const response = await APIInstance.post(`/th/groups/${groupId}/members/${memberId}/unmute`, {
        therapist_id: therapistId
    });
    return response.data;
};

/**
 * Remove member from group
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Removal confirmation
 * @example
 * const result = await removeMember(groupId, memberId, therapistId);
 * // Returns: { success: true, message: "Member removed from group successfully" }
 */
export const removeMember = async (groupId, memberId, therapistId) => {
    const response = await APIInstance.delete(`/th/groups/${groupId}/members/${memberId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
