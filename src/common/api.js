// src/common/api.js
import { getOrganizationId } from './sessionManager';

export const apiRequest = async (url, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  
  // Add Authorization header if auth is required
  if (auth) {
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add tenant context header for multi-tenant requests
  const organizationId = getOrganizationId();
  if (organizationId) {
    headers['X-Organization-Id'] = organizationId;
  }
  
  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};