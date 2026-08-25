import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export const NotificationsPage = ({ onSelectRequest }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, addToast } = useNotification();
  const [unreadFilter, setUnreadFilter] = useState(false);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const filteredNotifications = unreadFilter
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      addToast('Notification supprimée', 'info');
      refreshNotifications();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Centre de Notifications
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Historique complet des assignations, changements d'états de workflow et alertes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setUnreadFilter(!unreadFilter)}
            className={`btn btn-sm ${unreadFilter ? 'btn-primary' : 'btn-secondary'}`}
          >
            <span>{unreadFilter ? 'Afficher toutes' : 'Non lues uniquement'}</span>
          </button>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
              <CheckCheck size={14} />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Bell size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '0.95rem', fontWeight: '600' }}>Aucune notification à afficher</p>
            <p style={{ fontSize: '0.8125rem' }}>Vous êtes à jour dans vos alertes opérationnelles.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                markAsRead(notif._id);
                if (notif.relatedRequest && onSelectRequest) {
                  onSelectRequest(notif.relatedRequest._id || notif.relatedRequest);
                }
              }}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: notif.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${notif.isRead ? 'var(--border-color)' : 'rgba(99, 102, 241, 0.3)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: notif.relatedRequest ? 'pointer' : 'default',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = notif.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.1)')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: notif.isRead ? 'rgba(255, 255, 255, 0.05)' : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: notif.isRead ? 'var(--text-dim)' : 'var(--primary)',
                    flexShrink: 0
                  }}
                >
                  <Bell size={18} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: notif.isRead ? '600' : '800', color: 'var(--text-main)' }}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                    )}
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {notif.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {notif.relatedRequest && (
                      <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: '600' }}>
                        Cliquez pour ouvrir la demande →
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(notif._id, e)}
                className="btn-icon"
                style={{ padding: '0.4rem', color: 'var(--text-dim)' }}
                title="Supprimer la notification"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
