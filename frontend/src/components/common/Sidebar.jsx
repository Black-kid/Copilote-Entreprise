import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Bell, 
  PlusCircle, 
  Clock, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  Archive,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ currentView, onViewChange, onOpenNewRequest, onFilterByStatus, statusCounts = {} }) => {
  const { user, isAdmin, isManager } = useAuth();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'requests', label: 'Opérations & Demandes', icon: Layers },
    ...(isAdmin || isManager ? [{ id: 'users', label: 'Équipes & Utilisateurs', icon: Users }] : []),
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const STATUS_SHORTCUTS = [
    { label: 'Créée', key: 'Créée', icon: Layers, color: '#818cf8' },
    { label: 'En attente', key: 'En attente', icon: Clock, color: '#fbbf24' },
    { label: 'Assignée', key: 'Assignée', icon: UserCheck, color: '#38bdf8' },
    { label: 'En cours', key: 'En cours', icon: PlayCircle, color: '#c084fc' },
    { label: 'Terminée', key: 'Terminée', icon: CheckCircle2, color: '#34d399' },
    { label: 'Archivée', key: 'Archivée', icon: Archive, color: '#94a3b8' }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px'
      }}
    >
      {/* Action Button */}
      <div style={{ padding: '1.25rem 1rem 0.75rem 1rem' }}>
        <button
          onClick={onOpenNewRequest}
          className="btn btn-primary"
          style={{ width: '100%', gap: '0.625rem', height: '42px' }}
        >
          <PlusCircle size={18} />
          <span>Nouvelle Demande</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div style={{ padding: '0.75rem 0.75rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', fontWeight: '700' }}>
            Menu Principal
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}`,
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-dim)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Workflow Stages Quick Access */}
        <div style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', fontWeight: '700' }}>
            Filtre par État Workflow
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {STATUS_SHORTCUTS.map((st) => {
            const count = statusCounts[st.key] || 0;
            return (
              <button
                key={st.key}
                onClick={() => onFilterByStatus && onFilterByStatus(st.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: st.color
                    }}
                  />
                  <span>{st.label}</span>
                </div>
                {count > 0 && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-main)'
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Info Footer */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}
      >
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.department}
          </div>
        </div>
      </div>
    </aside>
  );
};
