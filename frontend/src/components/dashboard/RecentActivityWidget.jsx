import React from 'react';
import { History, ArrowRight, User } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

export const RecentActivityWidget = ({ activities = [], onSelectRequest }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <History size={18} color="var(--secondary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Journal d’Activité & Audit en Direct</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Derniers événements
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '350px' }}>
        {activities.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
            Aucune activité récente.
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act._id}
              onClick={() => act.request && onSelectRequest && onSelectRequest(act.request._id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                cursor: act.request ? 'pointer' : 'default',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                if (act.request) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (act.request) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <img
                src={act.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={act.user?.name || 'User'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {act.user?.name || 'Utilisateur'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {new Date(act.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.3', marginBottom: '0.35rem' }}>
                  {act.details}
                </p>

                {act.request && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="mono-font" style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700' }}>
                      {act.request.ticketNumber}
                    </span>
                    {act.request.status && <StatusBadge status={act.request.status} size="sm" showIcon={false} />}
                    {act.request.priority && <PriorityBadge priority={act.request.priority} size="sm" />}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
