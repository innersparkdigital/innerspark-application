/**
 * Image URL Helpers
 * Utilities for handling image URLs from the backend
 */
import { UPLOADS_BASE_URL } from '../config/env';
import { ImageSourcePropType } from 'react-native';

/**
 * Convert a backend image path to a full URL or return a fallback
 * @param imagePath - Image path from backend (can be relative or full URL)
 * @param fallbackImage - Local image to use if path is null/empty
 * @returns Image source object for React Native Image component
 * 
 * @example
 * // Relative path from backend
 * getImageSource('uploads/img_123.jpg', FALLBACK_IMAGES.default)
 * // Returns: { uri: 'https://app.innersparkafrica.us/uploads/img_123.jpg' }
 * 
 * // Full URL from backend
 * getImageSource('https://cdn.example.com/img.jpg', FALLBACK_IMAGES.default)
 * // Returns: { uri: 'https://cdn.example.com/img.jpg' }
 * 
 * // Null or empty path
 * getImageSource(null, FALLBACK_IMAGES.default)
 * // Returns: require('../assets/images/is-default.png')
 */
export const getImageSource = (
  imagePath: string | null | undefined,
  fallbackImage: ImageSourcePropType
): ImageSourcePropType => {
  // If no image path provided, use fallback
  if (!imagePath) {
    return fallbackImage;
  }

  // If already a full URL (starts with http/https), use as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return { uri: imagePath };
  }

  // Otherwise, it's a relative path - prepend uploads base URL
  return { uri: `${UPLOADS_BASE_URL}/${imagePath}` };
};

/**
 * Get full URL string for an uploaded image
 * @param imagePath - Relative image path from backend
 * @returns Full URL string or empty string if no path
 * 
 * @example
 * getUploadUrl('uploads/img_123.jpg')
 * // Returns: 'https://app.innersparkafrica.us/uploads/img_123.jpg'
 */
export const getUploadUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `${UPLOADS_BASE_URL}/${imagePath}`;
};

/**
 * Common fallback images used throughout the app
 * Use these constants instead of hardcoding require() statements
 */
export const FALLBACK_IMAGES = {
  /** Default placeholder for general content (events, articles, etc.) */
  default: require('../assets/images/is-default.png'),
  
  /** Avatar placeholder for users, organizers, therapists, etc. */
  avatar: require('../assets/images/avatar-placeholder.png'),
  
  /** Event cover image fallback */
  event: require('../assets/images/is-default.png'),
  
  /** Profile/user image fallback */
  profile: require('../assets/images/avatar-placeholder.png'),
  
  /** Group image fallback */
  group: require('../assets/images/is-default.png'),
  
  /** Meditation/article image fallback */
  meditation: require('../assets/images/is-default.png'),
  
  /** User/chat partner image fallback */
  user: require('../assets/images/avatar-placeholder.png'),
};
