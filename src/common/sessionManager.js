import { ALL_PERMISSIONS } from './permissions';

let _sessionTimer = null;

const decodeTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // convert to ms
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
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  } catch {
    return {};
  }
};

export const getPermissions = () => {
  const user = getCurrentUser();
  return Array.isArray(user.menuPermissions) && user.menuPermissions.length > 0
    ? user.menuPermissions
    : ALL_PERMISSIONS;
};

export const hasPermission = (permissionKey) => {
  return getPermissions().includes(permissionKey);
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
