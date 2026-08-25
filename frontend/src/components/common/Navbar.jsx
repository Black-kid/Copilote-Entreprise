import React, { useState, useRef, useEffect } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ShieldCheck, 
  Check, 
  Layers, 
  Search,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = ({ onSearch, searchQuery, onOpenNewRequest }) => {
  const { user, logout, loginAsDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleSwitcher(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchRole = async (email) => {
    try {
      await loginAsDemo(email);
      setShowRoleSwitcher(false);
    } catch (err) {
      console.error('Erreur changement de rôle:', err);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}
    >
      {/* Brand & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: '1' }}>
              Co<span style={{ color: 'var(--primary)' }}>Pilote</span>
            </h2>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: '700' }}>
              Entreprise
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
          <Search
            size={16}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Rechercher ticket, incident, demandeur..."
            value={searchQuery || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '36px',
              paddingRight: '12px',
              height: '38px',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--bg-input)'
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Quick Role Switcher Pill */}
        <div style={{ position: 'relative' }} ref={roleRef}>
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'rgba(99, 102, 241, 0.4)',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            title="Tester avec un autre rôle"
          >
            <ShieldCheck size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
              Rôle : <strong style={{ color: 'var(--primary)' }}>{user?.role}</strong>
            </span>
            <SlidersHorizontal size={12} color="var(--text-dim)" />
          </button>

          {showRoleSwitcher && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                padding: '0.875rem',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: '700' }}>
                  Bascule instantanée de profil Démo
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = user?.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      onClick={() => handleSwitchRole(acc.email)}
                      style={{
                        padding: '0.625rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {acc.name}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: acc.color, fontWeight: '600' }}>
                            {acc.role} • {acc.department}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check size={16} color="var(--primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon"
            style={{ position: 'relative' }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '380px',
                maxHeight: '460px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={16} color="var(--primary)" />
                  <h4 style={{ fontSize: '0.9rem' }}>Notifications ({unreadCount})</h4>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    Aucune notification pour le moment
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => markAsRead(notif._id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                        borderLeft: notif.isRead ? '3px solid transparent' : '3px solid var(--primary)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {notif.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {new Date(notif.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Basculer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
          aria-label="Basculer thème"
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* User Profile Pill */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--primary)'
              }}
            />
            <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.2' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                {user?.role}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '240px',
                padding: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200
              }}
            >
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user?.email}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className={`role-badge role-${user?.role?.toLowerCase().slice(0, 5)}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <div style={{ padding: '0.35rem 0' }}>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
