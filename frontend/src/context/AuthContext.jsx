import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile 
} from '../services/firebase';

const AuthContext = createContext(null);

export const SUPER_ADMIN_ROLE = {
  role: 'Super Administrator',
  roleKey: 'superadmin',
  department: 'Master Operations & Cloud Governance',
  permissions: [
    'all',
    'super_admin',
    'approve_requests',
    'manage_suppliers',
    'edit_budgets',
    'manage_users',
    'audit_access',
    'ai_copilot_access',
    'system_controls'
  ]
};

export const USERS = {
  superadmin: {
    id: 'super-0',
    name: 'Super Admin',
    email: 'superadmin@aderno.net',
    ...SUPER_ADMIN_ROLE,
    avatar: 'SA'
  },
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

function getInitials(name = '') {
  if (!name) return 'SA';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    // Check sessionStorage for demo preview first
    const demoSession = sessionStorage.getItem('aderno_user');
    if (demoSession) {
      try { return JSON.parse(demoSession); } catch {}
    }
    const saved = localStorage.getItem('aderno_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    if (sessionStorage.getItem('aderno_demo_mode') === 'true') {
      return 'demo_preview_session_key';
    }
    return localStorage.getItem('aderno_token') || null;
  });

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        sessionStorage.removeItem('aderno_demo_mode');
        sessionStorage.removeItem('aderno_user');
        const userToken = await user.getIdToken().catch(() => 'firebase_bearer_token');
        setToken(userToken);
        localStorage.setItem('aderno_token', userToken);

        // Retrieve existing role or default to Super Admin
        const savedData = localStorage.getItem(`aderno_profile_${user.uid}`);
        let profile = savedData ? JSON.parse(savedData) : null;

        if (!profile) {
          const displayName = user.displayName || user.email?.split('@')[0] || 'Super Administrator';
          profile = {
            id: user.uid,
            name: displayName,
            email: user.email,
            photoURL: user.photoURL,
            avatar: getInitials(displayName),
            ...SUPER_ADMIN_ROLE,
            isFirebase: true,
            isDemo: false
          };
          localStorage.setItem(`aderno_profile_${user.uid}`, JSON.stringify(profile));
        }

        setCurrentUser(profile);
        localStorage.setItem('aderno_user', JSON.stringify(profile));

        // Sync with backend SQLite
        try {
          fetch('http://127.0.0.1:8000/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar
            })
          }).catch(() => {});
        } catch {}
      } else {
        setFirebaseUser(null);
        // If in session-only demo mode, keep demo session; otherwise clear
        const isDemo = sessionStorage.getItem('aderno_demo_mode') === 'true';
        if (!isDemo) {
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem('aderno_user');
          localStorage.removeItem('aderno_token');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with Email & Password
  const loginWithEmail = async (email, password, rememberMe = true) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const userToken = await user.getIdToken();
      setToken(userToken);

      const savedData = localStorage.getItem(`aderno_profile_${user.uid}`);
      let profile = savedData ? JSON.parse(savedData) : null;

      if (!profile) {
        const displayName = user.displayName || email.split('@')[0];
        profile = {
          id: user.uid,
          name: displayName,
          email: user.email,
          photoURL: user.photoURL,
          avatar: getInitials(displayName),
          ...SUPER_ADMIN_ROLE,
          isFirebase: true
        };
        localStorage.setItem(`aderno_profile_${user.uid}`, JSON.stringify(profile));
      }

      setCurrentUser(profile);
      if (rememberMe) {
        localStorage.setItem('aderno_remember_email', email);
        localStorage.setItem('aderno_user', JSON.stringify(profile));
        localStorage.setItem('aderno_token', userToken);
      } else {
        localStorage.removeItem('aderno_remember_email');
        sessionStorage.setItem('aderno_user', JSON.stringify(profile));
      }
      localStorage.removeItem('aderno_demo_active');
      return { success: true, user: profile };
    } catch (err) {
      return { success: false, error: err.message, code: err.code };
    }
  };

  // Sign up with Email & Password
  const signupWithEmail = async ({ name, email, password, roleKey = 'superadmin' }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      if (name) {
        await updateProfile(user, { displayName: name }).catch(() => {});
      }

      const userToken = await user.getIdToken();
      setToken(userToken);

      const roleConfig = USERS[roleKey] || SUPER_ADMIN_ROLE;
      const profile = {
        id: user.uid,
        name: name || user.email.split('@')[0],
        email: user.email,
        photoURL: null,
        avatar: getInitials(name || user.email),
        role: roleConfig.role,
        roleKey: roleConfig.roleKey,
        department: roleConfig.department,
        permissions: roleConfig.permissions,
        isFirebase: true
      };

      localStorage.setItem(`aderno_profile_${user.uid}`, JSON.stringify(profile));
      setCurrentUser(profile);
      localStorage.setItem('aderno_user', JSON.stringify(profile));
      localStorage.setItem('aderno_token', userToken);
      localStorage.removeItem('aderno_demo_active');

      return { success: true, user: profile };
    } catch (err) {
      return { success: false, error: err.message, code: err.code };
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      const userToken = await user.getIdToken();
      setToken(userToken);

      const savedData = localStorage.getItem(`aderno_profile_${user.uid}`);
      let profile = savedData ? JSON.parse(savedData) : null;

      if (!profile) {
        profile = {
          id: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL,
          avatar: getInitials(user.displayName || user.email),
          ...SUPER_ADMIN_ROLE,
          isFirebase: true
        };
        localStorage.setItem(`aderno_profile_${user.uid}`, JSON.stringify(profile));
      }

      setCurrentUser(profile);
      localStorage.setItem('aderno_user', JSON.stringify(profile));
      localStorage.setItem('aderno_token', userToken);
      localStorage.removeItem('aderno_demo_active');

      return { success: true, user: profile };
    } catch (err) {
      return { success: false, error: err.message, code: err.code };
    }
  };

  // Demo View Mode (Showcase only, no real login key generated, not saved permanently)
  const loginDemo = () => {
    const demoUser = {
      id: 'demo-visitor-01',
      name: 'Demo Visitor',
      email: 'demo@aderno.net',
      role: 'Demo Viewer',
      roleKey: 'demoviewer',
      department: 'Procurement Intelligence Preview',
      avatar: 'DV',
      permissions: ['all'],
      isDemo: true
    };
    setCurrentUser(demoUser);
    setToken('demo_preview_session_key');
    // "its not login key its no need to save" -> Save in sessionStorage only, NEVER in localStorage
    sessionStorage.setItem('aderno_demo_mode', 'true');
    sessionStorage.setItem('aderno_user', JSON.stringify(demoUser));
    // Clear any persistent keys
    localStorage.removeItem('aderno_user');
    localStorage.removeItem('aderno_token');
    localStorage.removeItem('aderno_demo_active');
    return { success: true, user: demoUser };
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth).catch(() => {});
    } finally {
      setFirebaseUser(null);
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('aderno_user');
      localStorage.removeItem('aderno_token');
      localStorage.removeItem('aderno_demo_active');
      sessionStorage.removeItem('aderno_user');
      sessionStorage.removeItem('aderno_demo_mode');
    }
  };

  // Switch role preview
  const switchRole = (roleKey) => {
    if (USERS[roleKey]) {
      const updated = {
        ...currentUser,
        role: USERS[roleKey].role,
        roleKey: USERS[roleKey].roleKey,
        department: USERS[roleKey].department,
        permissions: USERS[roleKey].permissions
      };
      setCurrentUser(updated);
      localStorage.setItem('aderno_user', JSON.stringify(updated));
      if (firebaseUser) {
        localStorage.setItem(`aderno_profile_${firebaseUser.uid}`, JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      firebaseUser,
      token, 
      loading,
      isAuthenticated: !!currentUser,
      loginWithEmail, 
      signupWithEmail, 
      loginWithGoogle, 
      loginDemo,
      logout, 
      switchRole, 
      USERS,
      SUPER_ADMIN_ROLE 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
