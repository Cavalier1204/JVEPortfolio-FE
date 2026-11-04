export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Claims {
  id?: string;
  username?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  claims: User | null;
  isLoading: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authState: AuthState;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}
