import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

interface UserType {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: UserType | null;
  authToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserType) => void;
  logout: () => void;
}

const decodeJwt = (token: string): { exp: number } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const login = (token: string, user: UserType) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  };

  const scheduleAutoLogout = (token: string) => {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) {
      logout();
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const timeout = expiryTime - Date.now();

    if (timeout <= 0) {
      logout();
    } else {
      logoutTimerRef.current = setTimeout(() => logout(), timeout);
    }
  };

  useEffect(() => {
    if (authToken) {
      scheduleAutoLogout(authToken);
    }

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const value: AuthContextType = {
    user,
    authToken,
    isAuthenticated: !!authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};