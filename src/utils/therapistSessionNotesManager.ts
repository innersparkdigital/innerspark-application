/**
 * Therapist Session Notes Manager
 * Handles session notes API calls with graceful error handling
 * Returns empty arrays for 404 (no data available)
 */
import store from '../app/store';
import {
    updateClientNotes,
    addClientNote,
    updateClientNote as updateClientNoteAction,
    removeClientNote as removeClientNoteAction,
} from '../features/therapist/clientsSlice';
import {
    getSessionNotes,
    createSessionNote as createSessionNoteAPI,
    updateSessionNote as updateSessionNoteAPI,
    deleteSessionNote,
    getSessionNoteVersions,
} from '../api/therapist/sessionNotes';

/**
 * Load session notes for a client
 * Returns empty array if endpoint returns 404 (no data)
 */
export const loadSessionNotes = async (clientId: string, therapistId: string) => {
    try {
        console.log('📝 Loading session notes for client:', clientId);
        const response = await getSessionNotes(clientId, therapistId);

        if (response.success && response.data) {
            const notes = response.data.notes || [];
            console.log('📊 Session notes count:', notes.length);

            // Update Redux store
            store.dispatch(updateClientNotes({ clientId, notes }));
            return { success: true, notes };
        } else {
            console.log('⚠️ API response missing success or data:', response);
            store.dispatch(updateClientNotes({ clientId, notes: [] }));
            return { success: false, error: 'Invalid response format', notes: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading session notes:', error?.message);

        // Handle 404 - no notes available
        if (error?.response?.status === 404) {
            console.log('📦 GET /th/session-notes endpoint returns 404');
            store.dispatch(updateClientNotes({ clientId, notes: [] }));
            return { success: false, error: 'No notes available', isEmpty: true, notes: [] };
        }

        store.dispatch(updateClientNotes({ clientId, notes: [] }));
        return { success: false, error: error?.message || 'Failed to load notes', notes: [] };
    }
};

/**
 * Create a new session note
 */
export const createSessionNote = async (noteData: any) => {
    try {
        console.log('📝 Creating session note');
        const response = await createSessionNoteAPI(noteData);

        if (response.success) {
            console.log('✅ Session note created');

            // Add to Redux store
            if (response.data.note && noteData.client_id) {
                store.dispatch(addClientNote({ clientId: noteData.client_id, note: response.data.note }));
            }

            return { success: true, note: response.data.note };
        } else {
            return { success: false, error: response.message || 'Failed to create note' };
        }
    } catch (error: any) {
        console.log('❌ Error creating session note:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Create note endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to create note' };
    }
};

/**
 * Update a session note
 */
export const updateSessionNote = async (noteId: string, updateData: any, clientId: string) => {
    try {
        console.log('📝 Updating session note:', noteId);
        const response = await updateSessionNoteAPI(noteId, updateData);

        if (response.success) {
            console.log('✅ Session note updated');

            // Update in Redux store
            store.dispatch(updateClientNoteAction({ clientId, noteId, data: updateData }));

            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to update note' };
        }
    } catch (error: any) {
        console.log('❌ Error updating session note:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Update note endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to update note' };
    }
};

/**
 * Delete a session note
 */
export const deleteSessionNoteById = async (noteId: string, therapistId: string, clientId: string) => {
    try {
        console.log('📝 Deleting session note:', noteId);
        const response = await deleteSessionNote(noteId, therapistId);

        if (response.success) {
            console.log('✅ Session note deleted');

            // Remove from Redux store
            store.dispatch(removeClientNoteAction({ clientId, noteId }));

            return { success: true };
        } else {
            return { success: false, error: response.message || 'Failed to delete note' };
        }
    } catch (error: any) {
        console.log('❌ Error deleting session note:', error?.message);

        if (error?.response?.status === 404) {
            return { success: false, error: 'Delete note endpoint not implemented yet' };
        }

        return { success: false, error: error?.message || 'Failed to delete note' };
    }
};

/**
 * Get session note version history
 */
export const loadNoteVersions = async (noteId: string, therapistId: string) => {
    try {
        console.log('📜 Loading note version history for:', noteId);
        const response = await getSessionNoteVersions(noteId, therapistId);

        if (response.success && response.data) {
            const versions = response.data.versions || [];
            return { success: true, versions };
        } else {
            return { success: false, error: 'Invalid response format', versions: [] };
        }
    } catch (error: any) {
        console.log('❌ Error loading note versions:', error?.message);

        if (error?.response?.status === 404) {
            console.log('📦 Note versions endpoint returns 404');
            return { success: false, error: 'Version history not available', isEmpty: true, versions: [] };
        }

        return { success: false, error: error?.message || 'Failed to load versions', versions: [] };
    }
};
