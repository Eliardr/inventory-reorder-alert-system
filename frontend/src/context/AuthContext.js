import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // { _id, name, email, ... }
  const [loading, setLoading] = useState(true);   // while restoring session

  // Restore session on first load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        // backend returns { user: {...} }
        setUser(res.data?.user || null);
      } catch {
        // token invalid -> clean up
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (payload) => {
    // payload can be { token, user } or just user (we already stored token in Login.jsx)
    if (payload?.user) setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
