import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const USERS = {
  admin: {
    id: 1,
    name: 'David Vance',
    email: 'admin@aderno.net',
    role: 'Administrator',
    roleKey: 'admin',
    department: 'Executive Administration',
    avatar: 'DV',
    permissions: ['all', 'approve_requests', 'manage_suppliers', 'edit_budgets', 'manage_users', 'audit_access']
  },
  procurement: {
    id: 2,
    name: 'Sarah Jenkins',
    email: 'sarah.j@aderno.net',
    role: 'Procurement Manager',
    roleKey: 'procurement',
    department: 'Global Sourcing & Procurement',
    avatar: 'SJ',
    permissions: ['create_requests', 'approve_requests', 'manage_suppliers', 'create_po', 'audit_access']
  },
  finance: {
    id: 3,
    name: 'Marcus Sterling',
    email: 'marcus.s@aderno.net',
    role: 'Finance Officer',
    roleKey: 'finance',
    department: 'Corporate Finance & Treasury',
    avatar: 'MS',
    permissions: ['approve_requests', 'edit_budgets', 'view_analytics', 'manage_spending']
  },
  department: {
    id: 4,
    name: 'Elena Rostova',
    email: 'elena.r@aderno.net',
    role: 'Department User',
    roleKey: 'department',
    department: 'Engineering & Technology',
    avatar: 'ER',
    permissions: ['create_requests', 'view_own_requests', 'view_dept_budget']
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aderno_user');
    return saved ? JSON.parse(saved) : USERS.admin;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('aderno_token') || 'demo_token_authenticated_1.6';
  });

  const switchRole = (roleKey) => {
    if (USERS[roleKey]) {
      setCurrentUser(USERS[roleKey]);
      localStorage.setItem('aderno_user', JSON.stringify(USERS[roleKey]));
    }
  };

  const login = (email, password) => {
    const user = Object.values(USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setToken('demo_token_authenticated_1.6');
      localStorage.setItem('aderno_user', JSON.stringify(user));
      localStorage.setItem('aderno_token', 'demo_token_authenticated_1.6');
      return { success: true };
    }
    // Default fallback
    setCurrentUser(USERS.admin);
    return { success: true };
  };

  const logout = () => {
    // For demo convenience, stay in demo mode or reset to default
    setCurrentUser(USERS.admin);
  };

  return (
    <AuthContext.Provider value={{ currentUser, token, switchRole, login, logout, USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
