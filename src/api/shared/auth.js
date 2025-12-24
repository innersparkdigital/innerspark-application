/**
 * Shared Authentication API Functions
 * Used by both client and therapist flows
 */
import { APIInstance, AuthInstance } from '../LHAPI';


/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Login response with token and user data
 */
export const login = async (email, password) => {
    const response = await AuthInstance.post('/auth/login', {
        email,
        password
    });
    return response.data;
};

/**
 * User signup/registration
 * @param {Object} userData - { firstName, lastName, email, phone, password, role }
 * @returns {Promise} Signup response with token and user data
 */
export const signup = async (userData) => {
    const response = await AuthInstance.post('/auth/signup', userData);
    return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Full response with status and data
 */
export const resetPassword = async (email) => {
    const response = await AuthInstance.post('/auth/forgot-password', { email });
    return response;
};

/**
 * Verify password reset code
 * @param {string} email - User email
 * @param {string} otp - Reset code (6-digit OTP)
 * @returns {Promise} Verification result
 */
export const verifyResetCode = async (email, otp) => {
    const response = await AuthInstance.post('/auth/verify-reset-otp', {
        email: email,
        otp: otp
    });
    return response;
};

/**
 * Set new password after reset
 * @param {string} email - User email
 * @param {string} resetToken - Reset token from response
 * @param {string} newPassword - New password
 * @returns {Promise} Success message
 */
export const setNewPassword = async (email, resetToken, newPassword) => {
    const response = await AuthInstance.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword
    });
    return response;
};

/**
 * Logout user
 * @param {string} userId - User ID
 * @returns {Promise} Success message
 */
export const logout = async (userId) => {
    const response = await AuthInstance.post('/auth/logout', { userId });
    return response.data;
};

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} New access token
 */
export const refreshAuthToken = async (refreshToken) => {
    const response = await AuthInstance.post('/auth/refresh-token', {
        refreshToken
    });
    return response.data;
};

/**
 * Verify email address
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Promise} Verification result
 */
export const verifyEmail = async (email, otpcode) => {
    const response = await AuthInstance.post('/auth/verify-email', {
        email,
        otpcode
    });
    return response.data;
};

/**
 * Resend email verification code
 * @param {string} email - User email
 * @returns {Promise} Success message
 */
export const resendVerificationCode = async (email) => {
    const response = await AuthInstance.post('/auth/resend-verification', { email });
    return response.data;
};
