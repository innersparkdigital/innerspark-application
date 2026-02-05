/**
 * Therapist Session Notes API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Get session notes for a client
 * @param {string} clientId - Client ID
 * @param {string} therapistId - Therapist ID
 * @param {Object} [filters={}] - Filter options
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=20] - Items per page
 * @returns {Promise<{success: boolean, data: Object}>} Session notes list with pagination
 * @example
 * const result = await getSessionNotes(clientId, therapistId, { page: 1, limit: 20 });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     notes: [{
 * //       id: "note_001",
 * //       title: "Session Summary - Week 3",
 * //       content: "Client showed significant progress...",
 * //       type: "session",
 * //       date: "2025-10-20",
 * //       createdAt: "2025-10-20T15:30:00Z"
 * //     }]
 * //   }
 * // }
 */
export const getSessionNotes = async (clientId, therapistId, filters = {}) => {
    const response = await APIInstance.get(`/th/clients/${clientId}/notes`, {
        params: { therapist_id: therapistId, ...filters }
    });
    return response.data;
};

/**
 * Get session note by ID
 * @param {string} clientId - Client ID
 * @param {string} noteId - Note ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, data: Object}>} Session note details
 */
export const getSessionNoteById = async (clientId, noteId, therapistId) => {
    const response = await APIInstance.get(`/th/clients/${clientId}/notes/${noteId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};

/**
 * Create session note
 * @param {string} clientId - Client ID
 * @param {Object} noteData - Note details
 * @param {string} noteData.therapist_id - Therapist ID
 * @param {string} noteData.sessionDate - Session date (YYYY-MM-DD)
 * @param {number} noteData.duration - Session duration in minutes
 * @param {string} noteData.presentingIssues - Presenting issues discussed
 * @param {string} noteData.observations - Clinical observations
 * @param {string} noteData.interventions - Interventions used
 * @param {string} [noteData.homework] - Homework assigned
 * @param {string} [noteData.nextSteps] - Next steps planned
 * @param {boolean} [noteData.private=true] - Whether note is private to therapist
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Created session note
 * @example
 * const result = await createSessionNote(clientId, {
 *   therapist_id: therapistId,
 *   sessionDate: "2025-10-24",
 *   duration: 60,
 *   presentingIssues: "Anxiety management",
 *   observations: "Client showed progress",
 *   interventions: "CBT techniques",
 *   homework: "Practice breathing exercises",
 *   nextSteps: "Continue with anxiety management",
 *   private: true
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Note saved successfully",
 * //   data: { noteId: "note_001" }
 * // }
 */
export const createSessionNote = async (clientId, noteData) => {
    const response = await APIInstance.post(`/th/clients/${clientId}/notes`, noteData);
    return response.data;
};

/**
 * Update session note
 * @param {string} clientId - Client ID
 * @param {string} noteId - Note ID
 * @param {Object} updateData - Update details (same fields as createSessionNote)
 * @returns {Promise<{success: boolean, message: string, data: Object}>} Updated session note
 * @example
 * const result = await updateSessionNote(clientId, noteId, {
 *   therapist_id: therapistId,
 *   presentingIssues: "Updated issues",
 *   observations: "Updated observations"
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   message: "Note updated successfully",
 * //   data: { noteId: "note_001", updatedAt: "2025-10-23T16:00:00Z" }
 * // }
 */
export const updateSessionNote = async (clientId, noteId, updateData) => {
    const response = await APIInstance.put(`/th/clients/${clientId}/notes/${noteId}`, updateData);
    return response.data;
};

/**
 * Delete session note
 * @param {string} clientId - Client ID
 * @param {string} noteId - Note ID
 * @param {string} therapistId - Therapist ID
 * @returns {Promise<{success: boolean, message: string}>} Deletion confirmation
 * @example
 * const result = await deleteSessionNote(clientId, noteId, therapistId);
 * // Returns: { success: true, message: "Note deleted successfully" }
 */
export const deleteSessionNote = async (clientId, noteId, therapistId) => {
    const response = await APIInstance.delete(`/th/clients/${clientId}/notes/${noteId}`, {
        params: { therapist_id: therapistId }
    });
    return response.data;
};
