import React, { createContext, useState, useEffect, useContext } from "react";
import TokenManager from "../services/TokenManager";
import { AuthContextType, AuthState } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    claims: null,
  });

  useEffect(() => {
    const claims = TokenManager.getClaims();
    if (claims) {
      setAuthState({
        isAuthenticated: true,
        claims,
      });
    }
  }, []);

  const login = (_token?: string) => {
    const claims = TokenManager.getClaims();
    setAuthState({
      isAuthenticated: true,
      claims: claims ?? null,
    });
  };

  const logout = () => {
    TokenManager.clear();
    setAuthState({
      isAuthenticated: false,
      claims: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
