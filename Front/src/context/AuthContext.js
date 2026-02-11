import React, { createContext, useContext, useState, useCallback } from 'react';

/* ═══════════════════════════════════════
   DUMMY USERS
   ═══════════════════════════════════════ */
const DUMMY_USERS = [
  {
    id: 1,
    name: 'Student',
    firstname: 'caca1',
    email: 'caca1@leboncours.fr',
    role: 'Student',
    username: 'caca1',
    password: 'caca1',
    location: 'Paris, France',
    joinedAt: '2025-09-15',
    bio: 'Passionate learner interested in programming, math and languages. Currently studying React and calculus.',
    stats: { courses: 3, hours: 12, rating: 4.8, reviews: 5 },
  },
  {
    id: 2,
    name: 'Teacher',
    firstname: 'caca2',
    email: 'caca2@leboncours.fr',
    role: 'Teacher',
    username: 'caca2',
    password: 'caca2',
    location: 'Lyon, France',
    joinedAt: '2024-06-01',
    bio: 'Experienced software engineer and educator. Teaching React, TypeScript and Algorithms with 10+ years of industry experience.',
    stats: { courses: 2, hours: 340, rating: 4.9, reviews: 87 },
  },
];

/* ═══════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════ */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('lbc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username, password) => {
    const found = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      // Strip password before storing
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      sessionStorage.setItem('lbc_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('lbc_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
