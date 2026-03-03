import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    joinedGroupIds: [], // Array of group IDs user is joined to
    lastUpdated: null,
};

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        // Set the full list of joined group IDs
        setJoinedGroupIds: (state, action) => {
            state.joinedGroupIds = action.payload;
            state.lastUpdated = Date.now();
        },

        // Add a single group ID to joined list
        addJoinedGroupId: (state, action) => {
            const groupId = action.payload;
            if (!state.joinedGroupIds.includes(groupId)) {
                state.joinedGroupIds.push(groupId);
                state.lastUpdated = Date.now();
            }
        },

        // Remove a single group ID from joined list
        removeJoinedGroupId: (state, action) => {
            const groupId = action.payload;
            state.joinedGroupIds = state.joinedGroupIds.filter(id => id !== groupId);
            state.lastUpdated = Date.now();
        },

        // Clear all joined group IDs (e.g., on logout)
        clearJoinedGroupIds: (state) => {
            state.joinedGroupIds = [];
            state.lastUpdated = null;
        },
    },
});

export const {
    setJoinedGroupIds,
    addJoinedGroupId,
    removeJoinedGroupId,
    clearJoinedGroupIds,
} = groupsSlice.actions;

// Selectors
export const selectJoinedGroupIds = (state) => state.groups?.joinedGroupIds || [];
export const selectIsGroupJoined = (groupId) => (state) =>
    state.groups?.joinedGroupIds?.includes(groupId) || false;

export default groupsSlice.reducer;
