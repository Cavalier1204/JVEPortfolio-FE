import React, { useState, useEffect, useCallback, useMemo } from "react";
import AuthManager from "../services/AuthManager";
import { AuthContext } from "./AuthContext";
import { User, AuthContextType } from "../types";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const currentUser = await AuthManager.getMe();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (username: string, password: string): Promise<User> => {
      setIsLoading(true);
      try {
        const loggedInUser = await AuthManager.signin(username, password);
        setUser(loggedInUser);
        return loggedInUser;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthManager.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      authState: {
        isAuthenticated,
        user,
        claims: user,
        isLoading,
      },
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
