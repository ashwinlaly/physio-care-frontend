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

export const clearSessionTimer = () => {
  if (_sessionTimer) {
    clearTimeout(_sessionTimer);
    _sessionTimer = null;
  }
};

const expireSession = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/';
};
