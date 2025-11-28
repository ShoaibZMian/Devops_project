import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, isAuthenticated, isAdmin, getUserName, getUserRoles, decodeToken, logout as logoutUtil } from '../utils/auth';

// Define the shape of our auth context
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string | null;
  userRoles: string[];
  login: (token: string) => void;
  logout: () => void;
  refreshAuthState: () => void;
}

// Create the context with undefined as default (we'll provide it via provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [token, setToken] = useState<string | null>(() => getToken());
  const [authState, setAuthState] = useState({
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    userName: getUserName(),
    userRoles: getUserRoles(),
  });

  // Function to refresh auth state from localStorage
  const refreshAuthState = () => {
    const currentToken = getToken();
    setToken(currentToken);
    setAuthState({
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin(),
      userName: getUserName(),
      userRoles: getUserRoles(),
    });
  };

  // Login function - updates context and localStorage
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    // Decode token and update auth state
    const decoded = decodeToken(newToken);
    setAuthState({
      isAuthenticated: true,
      isAdmin: decoded?.role === 'Admin' || decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin',
      userName: decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded?.userName || null,
      userRoles: decoded && Array.isArray(decoded.role) ? decoded.role : decoded?.role ? [decoded.role] : [],
    });
  };

  // Logout function - clears context and localStorage
  const logout = () => {
    logoutUtil(); // Use existing utility to clear localStorage
    setToken(null);
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      userName: null,
      userRoles: [],
    });
  };

  // Check for token expiration on mount and periodically
  useEffect(() => {
    // Refresh state on mount
    refreshAuthState();

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      const currentToken = getToken();
      if (currentToken) {
        const stillAuthenticated = isAuthenticated();
        if (!stillAuthenticated) {
          // Token expired, logout
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const value: AuthContextType = {
    token,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    userName: authState.userName,
    userRoles: authState.userRoles,
    login,
    logout,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
