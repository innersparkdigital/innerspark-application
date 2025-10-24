import { createSlice } from "@reduxjs/toolkit";

/**
 * Therapist Groups Data
 * Stores support groups, members, messages, and related data
 */

export const groupsSlice = createSlice({
    name: 'therapistGroups',
    initialState: {
        groups: [],
        selectedGroup: null,
        groupMembers: {}, // { groupId: [members] }
        groupMessages: {}, // { groupId: [messages] }
        filters: {
            status: 'active',
        },
        stats: {
            activeGroups: 0,
            totalMembers: 0,
        },
        loading: false,
    },
    reducers: {
        updateGroups: (state, action) => {
            state.groups = action.payload;
        },

        addGroup: (state, action) => {
            state.groups.unshift(action.payload);
            if (action.payload.status === 'active') {
                state.stats.activeGroups += 1;
            }
        },

        updateGroup: (state, action) => {
            const index = state.groups.findIndex(g => g.id === action.payload.id);
            if (index !== -1) {
                state.groups[index] = { ...state.groups[index], ...action.payload };
            }
        },

        removeGroup: (state, action) => {
            const group = state.groups.find(g => g.id === action.payload);
            if (group && group.status === 'active') {
                state.stats.activeGroups = Math.max(0, state.stats.activeGroups - 1);
            }
            state.groups = state.groups.filter(g => g.id !== action.payload);
        },

        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },

        setGroupFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        updateGroupStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },

        updateGroupMembers: (state, action) => {
            const { groupId, members } = action.payload;
            state.groupMembers[groupId] = members;
        },

        addGroupMember: (state, action) => {
            const { groupId, member } = action.payload;
            if (!state.groupMembers[groupId]) {
                state.groupMembers[groupId] = [];
            }
            state.groupMembers[groupId].push(member);
        },

        updateGroupMember: (state, action) => {
            const { groupId, memberId, data } = action.payload;
            if (state.groupMembers[groupId]) {
                const index = state.groupMembers[groupId].findIndex(m => m.id === memberId);
                if (index !== -1) {
                    state.groupMembers[groupId][index] = { ...state.groupMembers[groupId][index], ...data };
                }
            }
        },

        removeGroupMember: (state, action) => {
            const { groupId, memberId } = action.payload;
            if (state.groupMembers[groupId]) {
                state.groupMembers[groupId] = state.groupMembers[groupId].filter(m => m.id !== memberId);
            }
        },

        updateGroupMessages: (state, action) => {
            const { groupId, messages } = action.payload;
            state.groupMessages[groupId] = messages;
        },

        addGroupMessage: (state, action) => {
            const { groupId, message } = action.payload;
            if (!state.groupMessages[groupId]) {
                state.groupMessages[groupId] = [];
            }
            state.groupMessages[groupId].push(message);
        },

        removeGroupMessage: (state, action) => {
            const { groupId, messageId } = action.payload;
            if (state.groupMessages[groupId]) {
                state.groupMessages[groupId] = state.groupMessages[groupId].filter(m => m.id !== messageId);
            }
        },

        setGroupsLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

// Action creators are generated for each case function
export const {
    updateGroups,
    addGroup,
    updateGroup,
    removeGroup,
    setSelectedGroup,
    setGroupFilter,
    updateGroupStats,
    updateGroupMembers,
    addGroupMember,
    updateGroupMember,
    removeGroupMember,
    updateGroupMessages,
    addGroupMessage,
    removeGroupMessage,
    setGroupsLoading,
} = groupsSlice.actions;

export default groupsSlice.reducer;
