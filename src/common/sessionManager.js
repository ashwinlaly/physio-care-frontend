import { ALL_PERMISSIONS } from './permissions';

let _sessionTimer = null;

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const decodeTokenExpiry = (token) => {
  try {
    const payload = decodeToken(token);
    return payload?.exp ? payload.exp * 1000 : null; // convert to ms
  } catch {
    return null;
  }
};

export const startSessionTimer = (token) => {
  clearSessionTimer();
  const expiresAt = decodeTokenExpiry(token);
  if (!expiresAt) return;

  const msUntilExpiry = expiresAt - Date.now();
  if (msUntilExpiry <= 0) {
    // Token already expired
    expireSession();
    return;
  }

  _sessionTimer = setTimeout(() => {
    expireSession();
  }, msUntilExpiry);
};

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('login', 'true');
  localStorage.setItem('currentUser', JSON.stringify(user || {}));
  
  // Extract and store multi-tenant context from token
  const tokenPayload = decodeToken(token);
  if (tokenPayload?.organizationId) {
    localStorage.setItem('organizationId', tokenPayload.organizationId);
  }
  if (tokenPayload?.userId) {
    localStorage.setItem('userId', tokenPayload.userId);
  }
};

/**
 * Get the current organization ID from token or localStorage
 * @returns {string|null} Organization ID
 */
export const getOrganizationId = () => {
  return localStorage.getItem('organizationId');
};

/**
 * Get the current user ID from token or localStorage
 * @returns {string|null} User ID
 */
export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  } catch {
    return {};
  }
};

/**
 * Get current user's permissions
 * Fetches from token payload or localStorage
 * @returns {string[]} Array of permission strings
 */
export const getPermissions = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = decodeToken(token);
      if (payload?.permissions && Array.isArray(payload.permissions)) {
        return payload.permissions;
      }
    }
  } catch (error) {
    console.warn('Error decoding permissions from token:', error);
  }
  
  // Fallback to user object permissions
  const user = getCurrentUser();
  if (Array.isArray(user.permissions) && user.permissions.length > 0) {
    return user.permissions;
  }
  
  // Fallback to legacy menuPermissions
  if (Array.isArray(user.menuPermissions) && user.menuPermissions.length > 0) {
    return user.menuPermissions;
  }
  
  return ALL_PERMISSIONS;
};

/**
 * Check if current user has a specific permission
 * Supports permission hierarchy: manage > update > create > read
 * @param {string} permissionKey - Permission to check (e.g., 'patients.read')
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (permissionKey) => {
  const userPermissions = getPermissions();
  
  // Direct match
  if (userPermissions.includes(permissionKey)) {
    return true;
  }
  
  // Permission hierarchy: manage > update > create > read
  // If user has a higher-level permission, they implicitly have lower-level ones
  const [resource, action] = permissionKey.split('.');
  if (!resource || !action) {
    return false;
  }
  
  const hierarchy = ['read', 'create', 'update', 'delete', 'manage'];
  const requiredLevel = hierarchy.indexOf(action);
  
  if (requiredLevel === -1) {
    // Unknown action, fall back to direct match only
    return false;
  }
  
  // Check if user has any higher-level permission for this resource
  for (let i = requiredLevel + 1; i < hierarchy.length; i++) {
    const higherPermission = `${resource}.${hierarchy[i]}`;
    if (userPermissions.includes(higherPermission)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Check if user has any of the provided permissions (OR logic)
 * Supports permission hierarchy: manage > update > create > read
 * @param {string|string[]} permissionKeys - Permission or array of permissions to check
 * @returns {boolean} True if user has any permission
 */
export const hasAnyPermission = (permissionKeys) => {
  const permArray = Array.isArray(permissionKeys) ? permissionKeys : [permissionKeys];
  return permArray.some(perm => hasPermission(perm));
};

/**
 * Check if user has all of the provided permissions (AND logic)
 * Supports permission hierarchy: manage > update > create > read
 * @param {string|string[]} permissionKeys - Permission or array of permissions to check
 * @returns {boolean} True if user has all permissions
 */
export const hasAllPermissions = (permissionKeys) => {
  const permArray = Array.isArray(permissionKeys) ? permissionKeys : [permissionKeys];
  return permArray.every(perm => hasPermission(perm));
};

export const clearSessionTimer = () => {
  if (_sessionTimer) {
    clearTimeout(_sessionTimer);
    _sessionTimer = null;
  }
};

const expireSession = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('login');
  localStorage.removeItem('currentUser');
  window.location.href = '/';
};
