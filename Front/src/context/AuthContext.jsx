import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiLogin, apiRegister, apiUpdateUser } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('lbc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('lbc_token') || null;
  });

  const saveSession = useCallback((userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem('lbc_user', JSON.stringify(userData));
    sessionStorage.setItem('lbc_token', jwt);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      saveSession(res.user, res.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    }
  }, [saveSession]);

  const register = useCallback(async ({ name, firstname, email, role, password }) => {
    try {
      const res = await apiRegister({ name, firstname, email, role, password });
      saveSession(res.user, res.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  }, [saveSession]);

  const updateUser = useCallback(async (fields) => {
    const res = await apiUpdateUser(user.id, fields, token);
    const updated = { ...user, ...fields, ...(res?.user || {}) };
    setUser(updated);
    sessionStorage.setItem('lbc_user', JSON.stringify(updated));
    return updated;
  }, [user, token]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('lbc_user');
    sessionStorage.removeItem('lbc_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
