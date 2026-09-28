// src/common/auditApi.js
import { apiRequest } from './api';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

/**
 * Get audit logs with filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.userId - Filter by user ID
 * @param {string} filters.resourceType - Filter by resource type
 * @param {string} filters.action - Filter by action
 * @param {string} filters.startDate - Start date (ISO format)
 * @param {string} filters.endDate - End date (ISO format)
 * @param {number} filters.limit - Maximum results (default 100)
 * @param {number} filters.offset - Pagination offset (default 0)
 * @returns {Promise<Object>} Audit logs data
 */
export const getAuditLogs = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.userId) queryParams.append('userId', filters.userId);
  if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
  if (filters.action) queryParams.append('action', filters.action);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  if (filters.limit) queryParams.append('limit', filters.limit);
  if (filters.offset) queryParams.append('offset', filters.offset);
  
  const url = `${BASE_URL}/audit-logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  return apiRequest(url, { method: 'GET', auth: true });
};

/**
 * Get a single audit log entry
 * @param {string} logId - Audit log ID
 * @returns {Promise<Object>} Audit log data
 */
export const getAuditLogById = async (logId) => {
  const url = `${BASE_URL}/audit-logs/${logId}`;
  return apiRequest(url, { method: 'GET', auth: true });
};

/**
 * Get resource change history
 * @param {string} resourceType - Resource type (e.g., ROLE, USER)
 * @param {string} resourceId - Resource ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum results (default 100)
 * @param {number} options.offset - Pagination offset (default 0)
 * @returns {Promise<Object>} Resource history data
 */
export const getResourceHistory = async (resourceType, resourceId, options = {}) => {
  const queryParams = new URLSearchParams();
  
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.offset) queryParams.append('offset', options.offset);
  
  const url = `${BASE_URL}/audit-logs/resource/${resourceType}/${resourceId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  return apiRequest(url, { method: 'GET', auth: true });
};

/**
 * Get user activity (all audit logs for actions performed by a user)
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum results (default 100)
 * @param {number} options.offset - Pagination offset (default 0)
 * @returns {Promise<Object>} User activity data
 */
export const getUserActivity = async (userId, options = {}) => {
  const queryParams = new URLSearchParams();
  
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.offset) queryParams.append('offset', options.offset);
  
  const url = `${BASE_URL}/audit-logs/user/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  return apiRequest(url, { method: 'GET', auth: true });
};

/**
 * Get audit statistics summary
 * @returns {Promise<Object>} Audit stats data
 */
export const getAuditStats = async () => {
  const url = `${BASE_URL}/audit-logs/stats/summary`;
  return apiRequest(url, { method: 'GET', auth: true });
};

/**
 * Export audit logs as CSV
 * @param {Object} filters - Filter parameters (same as getAuditLogs)
 * @returns {Promise<Blob>} CSV file blob
 */
export const exportAuditLogsCSV = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.userId) queryParams.append('userId', filters.userId);
  if (filters.resourceType) queryParams.append('resourceType', filters.resourceType);
  if (filters.action) queryParams.append('action', filters.action);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  
  const url = `${BASE_URL}/audit-logs/export/csv${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  
  const token = localStorage.getItem('authToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.blob();
};
