import { createContext, useEffect, useState } from "react";

import { logout as logoutRequest } from "../services/authService";
import {
  getProfileFromStorage,
  getStoredToken,
  persistSession,
  removeSession,
} from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getProfileFromStorage());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const login = ({ token: nextToken, refresh_token: refreshToken, user: nextUser }) => {
    persistSession(nextToken, nextUser, refreshToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutRequest();
      }
    } catch {
      // Clear local session even if the API call fails.
    }

    removeSession();
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    initializing,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
