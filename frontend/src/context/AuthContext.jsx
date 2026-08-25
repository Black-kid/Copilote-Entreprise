import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  {
    role: 'Administrateur',
    email: 'admin@opsflow.com',
    name: 'Sophie Martin',
    jobTitle: 'Directrice des Opérations & SI',
    department: 'Direction Générale',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    color: '#ec4899'
  },
  {
    role: 'Manager',
    email: 'manager@opsflow.com',
    name: 'Marc Dubois',
    jobTitle: 'Responsable Opérationnel',
    department: 'Opérations & Logistique',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    color: '#8b5cf6'
  },
  {
    role: 'Technicien',
    email: 'technicien@opsflow.com',
    name: 'Alexandre Bernard',
    jobTitle: 'Technicien Systèmes & Réseaux Senior',
    department: 'Support & Maintenance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#0ea5e9'
  },
  {
    role: 'Employé',
    email: 'employe@opsflow.com',
    name: 'Thomas Leroy',
    jobTitle: 'Analyste Financier',
    department: 'Finance & Comptabilité',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#10b981'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session
  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.warn('Session expirée ou invalide, déconnexion.');
          api.setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  };

  const loginAsDemo = async (email) => {
    return login(email, 'Password123!');
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  // Helper permission checks
  const isAdmin = user?.role === 'Administrateur';
  const isManager = user?.role === 'Manager';
  const isTech = user?.role === 'Technicien';
  const isEmployee = user?.role === 'Employé';

  // Can validate/assign requests
  const canManageRequests = isAdmin || isManager;
  // Can perform technician actions
  const canWorkOnRequests = isAdmin || isManager || isTech;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsDemo,
        logout,
        updateUserProfile,
        isAdmin,
        isManager,
        isTech,
        isEmployee,
        canManageRequests,
        canWorkOnRequests
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
