import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, tokenStorage } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(tokenStorage.getUser());
  const [token, setToken] = useState(tokenStorage.get());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.get();
      if (storedToken) {
        try {
          const res = await api.auth.me();
          if (res && res.data) {
            setUser(res.data);
            tokenStorage.set(storedToken, res.data);
          }
        } catch (err) {
          console.warn('Session check failed:', err);
          tokenStorage.clear();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      tokenStorage.set(data.token, data.user);
    }
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await api.auth.register({ fullName, email, password });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      tokenStorage.set(data.token, data.user);
    }
    return data;
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    tokenStorage.set(token, updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
