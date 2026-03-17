import { createContext, useEffect, useState } from "react";

import { adminLogout } from "../services/adminAuthService";
import {
  getAdminProfileFromStorage,
  getStoredAdminToken,
  persistAdminSession,
  removeAdminSession,
} from "../utils/storage";

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(getStoredAdminToken());
  const [user, setUser] = useState(getAdminProfileFromStorage());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const login = ({ token: nextToken, refresh_token: refreshToken, user: nextUser }) => {
    persistAdminSession(nextToken, nextUser, refreshToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    if (token) {
      adminLogout().catch(() => undefined);
    }
    removeAdminSession();
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    initializing,
    isAuthenticated: Boolean(token && user?.is_admin),
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
