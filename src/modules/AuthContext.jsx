import { createContext, useState, useEffect, useContext } from "react";
import TokenManager from "../services/TokenManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
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

  const login = (token) => {
    const claims = TokenManager.getClaims();
    setAuthState({
      isAuthenticated: true,
      claims,
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

export const useAuth = () => useContext(AuthContext);
