import {
  API_DEVELOPMENT_URL as DEV_URL,
  API_PRODUCTION_URL as PROD_URL,
  API_VERSION as VERSION,
  AUTH_TOKEN as TOKEN,
} from '@env';

// Development environment variables
export const API_DEVELOPMENT_URL = DEV_URL || 'https://server.innersparkafrica.us/api';

// Production environment variables
export const API_PRODUCTION_URL = PROD_URL || 'https://server.innersparkafrica.us/api';

// API version
export const API_VERSION = VERSION || '';

// Auth token
export const AUTH_TOKEN = TOKEN || '';

// Log the environment variables for debugging
console.log('🚀 === ENVIRONMENT CONFIG LOADED ===');
console.log('📍 Raw imports from @env:');
console.log('  DEV_URL:', DEV_URL);
console.log('  PROD_URL:', PROD_URL);
console.log('  VERSION:', VERSION);
console.log('  TOKEN:', TOKEN);
console.log('📍 Processed values:');
console.log('  API_DEVELOPMENT_URL:', API_DEVELOPMENT_URL);
console.log('  API_PRODUCTION_URL:', API_PRODUCTION_URL);
console.log('  API_VERSION:', API_VERSION);
console.log('  AUTH_TOKEN:', AUTH_TOKEN);
console.log('  __DEV__:', __DEV__);
console.log('  API_BASE_URL will be:', __DEV__ ? API_DEVELOPMENT_URL : API_PRODUCTION_URL);
console.log('🚀 === END ENVIRONMENT CONFIG ===');

// Export the appropriate URL based on the environment
export const API_BASE_URL = __DEV__ ? API_DEVELOPMENT_URL : API_PRODUCTION_URL;
