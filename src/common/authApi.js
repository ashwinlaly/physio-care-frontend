// src/common/authApi.js
/**
 * Authentication API client
 * Handles all auth-related API calls (signup, login, etc.)
 */

import { apiRequest } from './api';

/**
 * Sign up a new organization with admin user
 * @param {Object} data - Signup data
 * @param {string} data.organizationName - Organization name
 * @param {string} data.organizationEmail - Organization email (must be unique)
 * @param {string} data.adminName - Admin user full name
 * @param {string} data.adminEmail - Admin user email (must be globally unique)
 * @param {string} data.adminPassword - Admin user password
 * @returns {Promise<Object>} Response with token and organization details
 * @throws {Error} Error with code property if email conflicts
 */
export const signupOrganization = async (data) => {
  try {
    const response = await apiRequest(
      `${process.env.REACT_APP_API_URL}/organizations/signup`,
      {
        method: 'POST',
        body: data,
      }
    );
    return response;
  } catch (error) {
    // Parse error code from response
    const errorCode = error.response?.data?.code || error.code;
    throw {
      ...error,
      code: errorCode,
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * User login (organization-agnostic)
 * @param {Object} data - Login data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @returns {Promise<Object>} Response with token and user details
 */
export const userLogin = async (data) => {
  try {
    const response = await apiRequest(
      `${process.env.REACT_APP_API_URL}/organizations/login`,
      {
        method: 'POST',
        body: data,
      }
    );
    return response;
  } catch (error) {
    throw {
      ...error,
      message: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest(
      `${process.env.REACT_APP_API_URL}/user/me`,
      {
        auth: true,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout - clears local session
 * (Backend doesn't require logout call, just token removal)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};
