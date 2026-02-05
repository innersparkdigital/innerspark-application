/**
 * Therapist Groups Manager
 * Handles support groups API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import store from '../app/store';
import {
    updateGroups,
    setSelectedGroup,
    setGroupsLoading,
} from '../features/therapist/groupsSlice';
import {
    getGroups,
    getGroupById,
    createGroup as createGroupAPI,
    updateGroup as updateGroupAPI,
    archiveGroup as archiveGroupAPI,
    getGroupMessages,
    sendGroupMessage as sendGroupMessageAPI,
    sendAnnouncement as sendAnnouncementAPI,
    deleteGroupMessage as deleteGroupMessageAPI,
} from '../api/therapist/groups';
import {
    getGroupMembers,
    getGroupMemberProfile,
    updateMemberRole as updateMemberRoleAPI,
    muteMember as muteMemberAPI,
    unmuteMember as unmuteMemberAPI,
    removeMember as removeMemberAPI,
} from '../api/therapist/groupMembers';

/**
 * Load groups list from API
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadGroups = async (therapistId: string, filters: any = {}) => {
    store.dispatch(setGroupsLoading(true));

    try {
        console.log('👥 Loading groups from API with filters:', filters);
        const response = await getGroups(therapistId, filters);

        if (response.success && response.data) {
            const groups = response.data.groups || [];
            console.log('📊 Groups count:', groups.length);

            store.dispatch(updateGroups(groups));
            return { success: true, groups, stats: response.data.stats };
        } else {
            console.log('⚠️ API response missing success or data');
            store.dispatch(updateGroups([]));
            return { success: false, error: 'Invalid response format', groups: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading groups:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 GET /th/groups endpoint returns 404');
            store.dispatch(updateGroups([]));
            return { success: false, error: 'No groups available', isEmpty: true, groups: [] };
        }

        store.dispatch(updateGroups([]));
        return { success: false, error: error?.message || 'Failed to load groups', groups: [] };
    } finally {
        store.dispatch(setGroupsLoading(false));
    }
};

/**
 * Load group details by ID
 */
export const loadGroupDetails = async (groupId: string, therapistId: string) => {
    try {
        console.log('👥 Loading group details for ID:', groupId);
        const response = await getGroupById(groupId, therapistId);

        if (response.success && response.data) {
            store.dispatch(setSelectedGroup(response.data));
            return { success: true, group: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading group details:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Group not found' };
        }

        return { success: false, error: error?.message || 'Failed to load group details' };
    }
};

/**
 * Create a new group
 */
export const createGroup = async (groupData: any) => {
    try {
        console.log('👥 Creating new group');
        const response = await createGroupAPI(groupData);

        if (response.success) {
            console.log('✅ Group created successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to create group' };
        }
    } catch (error: any) {
        console.log('❌ Error creating group:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create group endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create group' };
    }
};

/**
 * Update a group
 */
export const updateGroup = async (groupId: string, updateData: any) => {
    try {
        console.log('👥 Updating group:', groupId);
        const response = await updateGroupAPI(groupId, updateData);

        if (response.success) {
            console.log('✅ Group updated successfully');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update group' };
        }
    } catch (error: any) {
        console.log('❌ Error updating group:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update group endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update group' };
    }
};

/**
 * Archive a group
 */
export const archiveGroup = async (groupId: string, therapistId: string) => {
    try {
        console.log('👥 Archiving group:', groupId);
        const response = await archiveGroupAPI(groupId, therapistId);

        if (response.success) {
            console.log('✅ Group archived successfully');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to archive group' };
        }
    } catch (error: any) {
        console.log('❌ Error archiving group:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Archive group endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to archive group' };
    }
};

/**
 * Load group messages
 */
export const loadGroupMessages = async (groupId: string, therapistId: string, page: number = 1, limit: number = 50) => {
    try {
        console.log('💬 Loading group messages for:', groupId);
        const response = await getGroupMessages(groupId, therapistId, page, limit);

        if (response.success && response.data) {
            const messages = response.data.messages || [];
            return { success: true, messages };
        } else {
            return { success: false, error: 'Invalid response format', messages: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading group messages:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'No messages available', isEmpty: true, messages: [] };
        }

        return { success: false, error: error?.message || 'Failed to load messages', messages: [] };
    }
};

/**
 * Send group message
 */
export const sendGroupMessage = async (groupId: string, therapistId: string, content: string) => {
    try {
        console.log('💬 Sending group message');
        const response = await sendGroupMessageAPI(groupId, therapistId, content);

        if (response.success) {
            console.log('✅ Message sent');
            return { success: true, message: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to send message' };
        }
    } catch (error: any) {
        console.log('❌ Error sending message:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Send message endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to send message' };
    }
};

/**
 * Send group announcement
 */
export const sendAnnouncement = async (groupId: string, therapistId: string, content: string) => {
    try {
        console.log('📢 Sending group announcement');
        const response = await sendAnnouncementAPI(groupId, therapistId, content);

        if (response.success) {
            console.log('✅ Announcement sent');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to send announcement' };
        }
    } catch (error: any) {
        console.log('❌ Error sending announcement:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Send announcement endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to send announcement' };
    }
};

/**
 * Delete group message (moderation)
 */
export const deleteGroupMessage = async (groupId: string, messageId: string, therapistId: string) => {
    try {
        console.log('🗑️ Deleting group message:', messageId);
        const response = await deleteGroupMessageAPI(groupId, messageId, therapistId);

        if (response.success) {
            console.log('✅ Message deleted');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to delete message' };
        }
    } catch (error: any) {
        console.log('❌ Error deleting message:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Delete message endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to delete message' };
    }
};

/**
 * Load group members
 */
export const loadGroupMembers = async (groupId: string, therapistId: string, filters: any = {}) => {
    try {
        console.log('👥 Loading group members for:', groupId);
        const response = await getGroupMembers(groupId, therapistId, filters);

        if (response.success && response.data) {
            const members = response.data.members || [];
            return { success: true, members };
        } else {
            return { success: false, error: 'Invalid response format', members: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading members:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'No members available', isEmpty: true, members: [] };
        }

        return { success: false, error: error?.message || 'Failed to load members', members: [] };
    }
};

/**
 * Load member profile (group context)
 */
export const loadMemberProfile = async (groupId: string, memberId: string, therapistId: string) => {
    try {
        console.log('👤 Loading member profile:', memberId);
        const response = await getGroupMemberProfile(groupId, memberId, therapistId);

        if (response.success && response.data) {
            return { success: true, member: response.data };
        } else {
            return { success: false, error: 'Invalid response format' };
        }
    } catch (error: any) {
        console.log('❌ Error loading member profile:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Member not found' };
        }

        return { success: false, error: error?.message || 'Failed to load member profile' };
    }
};

/**
 * Update member role (member/moderator)
 */
export const updateMemberRole = async (groupId: string, memberId: string, therapistId: string, role: 'member' | 'moderator') => {
    try {
        console.log('🔄 Updating member role:', memberId, 'to', role);
        const response = await updateMemberRoleAPI(groupId, memberId, therapistId, role);

        if (response.success) {
            console.log('✅ Member role updated');
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.message || 'Failed to update role' };
        }
    } catch (error: any) {
        console.log('❌ Error updating role:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update role endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update role' };
    }
};

/**
 * Mute a member
 */
export const muteMember = async (groupId: string, memberId: string, therapistId: string, duration: number) => {
    try {
        console.log('🔇 Muting member:', memberId, 'for', duration, 'seconds');
        const response = await muteMemberAPI(groupId, memberId, therapistId, duration);

        if (response.success) {
            console.log('✅ Member muted');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to mute member' };
        }
    } catch (error: any) {
        console.log('❌ Error muting member:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Mute endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to mute member' };
    }
};

/**
 * Unmute a member
 */
export const unmuteMember = async (groupId: string, memberId: string, therapistId: string) => {
    try {
        console.log('🔊 Unmuting member:', memberId);
        const response = await unmuteMemberAPI(groupId, memberId, therapistId);

        if (response.success) {
            console.log('✅ Member unmuted');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to unmute member' };
        }
    } catch (error: any) {
        console.log('❌ Error unmuting member:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Unmute endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to unmute member' };
    }
};

/**
 * Remove member from group
 */
export const removeMember = async (groupId: string, memberId: string, therapistId: string) => {
    try {
        console.log('🚫 Removing member:', memberId);
        const response = await removeMemberAPI(groupId, memberId, therapistId);

        if (response.success) {
            console.log('✅ Member removed');
            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to remove member' };
        }
    } catch (error: any) {
        console.log('❌ Error removing member:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Remove member endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to remove member' };
    }
};
