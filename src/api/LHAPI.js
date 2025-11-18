import axios from 'axios';
import { API_BASE_URL, API_VERSION, AUTH_TOKEN } from '../config/env';

console.log('🔧 === LHAPI.js LOADED ===');
console.log('  Imported API_BASE_URL:', API_BASE_URL);
console.log('  Imported API_VERSION:', API_VERSION);
console.log('  Imported AUTH_TOKEN:', AUTH_TOKEN);
console.log('🔧 === END LHAPI.js ===');

export const baseUrlRoot = API_BASE_URL;
export const baseUrlV1 = API_VERSION;
export const authToken = AUTH_TOKEN;

export const APIInstance = axios.create({ 
    baseURL: baseUrlRoot + baseUrlV1,
    timeout: 30000, // 30 second timeout to prevent 524 errors
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'application/json',
    }
}); // Axios instance for API requests

export const baseUrl = baseUrlRoot + baseUrlV1; // Base URL for API requests

/**
 * DEPRECATED: APIGlobaltHeaders
 * This function is no longer needed as headers are set directly in axios instances.
 * Kept for backward compatibility with existing screens.
 * @deprecated Use APIInstance or FileUploadInstance directly
 */
export const APIGlobaltHeaders = () => {
    // No-op function for backward compatibility
    // Headers are now set in APIInstance and FileUploadInstance
    console.warn('⚠️ APIGlobaltHeaders is deprecated. Headers are now set in axios instances.');
};

// File upload instance for multipart form data (profile images, attachments, etc)
export const FileUploadInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000, // 60 second timeout for file uploads
    headers: {
        'x-api-key': authToken,
        'Content-Type': 'multipart/form-data',
    }
});

// Request interceptor - Add dynamic auth tokens if needed
APIInstance.interceptors.request.use(
    (config) => {
        // You can add dynamic token logic here if needed
        // const token = getStoredToken();
        // if (token) config.headers['x-api-key'] = token;
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Global error handling
APIInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors globally
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401) {
                console.error('Unauthorized - Token may be invalid');
                // TODO: Redirect to login or refresh token
            } else if (status === 403) {
                console.error('Forbidden - Access denied');
            } else if (status === 500) {
                console.error('Server Error - Please try again later');
            }
        } else if (error.request) {
            console.error('Network Error - No response received');
        }
        
        return Promise.reject(error);
    }
);
 
