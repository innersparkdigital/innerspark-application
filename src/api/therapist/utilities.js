/**
 * Therapist Utilities API Functions
 */
import { APIInstance } from '../LHAPI';


/**
 * Global search across clients, appointments, and groups
 * @param {string} therapistId - Therapist ID
 * @param {string} query - Search query string
 * @param {'all'|'clients'|'appointments'|'groups'} [type='all'] - Search type filter
 * @returns {Promise<{success: boolean, data: Object}>} Search results grouped by type
 * @example
 * const result = await globalSearch(therapistId, 'john', 'all');
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     clients: [{ id: "client_123", name: "John Doe", ... }],
 * //     appointments: [{ id: "apt_001", clientName: "John Doe", ... }],
 * //     groups: []
 * //   }
 * // }
 */
export const globalSearch = async (therapistId, query, type = 'all') => {
    const response = await APIInstance.get('/th/search', {
        params: { therapist_id: therapistId, query, type }
    });
    return response.data;
};

/**
 * Upload file
 * **NOTE**: This endpoint accepts multipart/form-data
 * @param {string} therapistId - Therapist ID
 * @param {File} file - File to upload
 * @returns {Promise<{success: boolean, data: Object}>} Upload confirmation with file URL and metadata
 * @example
 * const result = await uploadFile(therapistId, fileObject);
 * // Returns:
 * // {
 * //   success: true,
 * //   data: {
 * //     fileId: "file_001",
 * //     url: "https://storage.innerspark.com/files/...",
 * //     filename: "document.pdf",
 * //     size: 1024000,
 * //     mimeType: "application/pdf"
 * //   }
 * // }
 */
export const uploadFile = async (therapistId, file) => {
    const formData = new FormData();
    formData.append('therapist_id', therapistId);
    formData.append('file', file);

    const response = await APIInstance.post('/th/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
