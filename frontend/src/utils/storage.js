const TOKEN_KEY = "smart_todo_token";
const USER_KEY = "smart_todo_user";
const REFRESH_TOKEN_KEY = "smart_todo_refresh_token";
const ADMIN_TOKEN_KEY = "smart_todo_admin_token";
const ADMIN_REFRESH_TOKEN_KEY = "smart_todo_admin_refresh_token";
const ADMIN_USER_KEY = "smart_todo_admin_user";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getProfileFromStorage() {
  const rawValue = localStorage.getItem(USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminProfileFromStorage() {
  const rawValue = localStorage.getItem(ADMIN_USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function persistSession(token, user, refreshToken) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function persistAdminSession(token, user, refreshToken) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function removeSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function removeAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
}
