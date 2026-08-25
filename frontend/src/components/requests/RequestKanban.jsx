import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Clock, User, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';

const COLUMNS = [
  { key: 'Créée', label: '1. Créée', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.4)' },
  { key: 'En attente', label: '2. En attente', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' },
  { key: 'Assignée', label: '3. Assignée', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.4)' },
  { key: 'En cours', label: '4. En cours', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.4)' },
  { key: 'Terminée', label: '5. Terminée', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' },
  { key: 'Archivée', label: '6. Archivée', color: '#94a3b8', borderColor: 'rgba(148, 163, 184, 0.3)' }
];

export const RequestKanban = ({ requests = [], onSelectRequest }) => {
  // Group requests by status
  const grouped = {};
  COLUMNS.forEach(col => {
    grouped[col.key] = [];
  });

  requests.forEach(req => {
    if (grouped[req.status]) {
      grouped[req.status].push(req);
    } else {
      // Fallback
      if (!grouped['Créée']) grouped['Créée'] = [];
      grouped['Créée'].push(req);
    }
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(270px, 1fr))',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1.5rem'
      }}
    >
      {COLUMNS.map((col) => {
        const columnRequests = grouped[col.key] || [];

        return (
          <div
            key={col.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              borderTop: `3px solid ${col.color}`,
              minHeight: '520px',
              maxHeight: '75vh'
            }}
          >
            {/* Column Header */}
            <div
              style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {col.label}
                </h4>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)'
                }}
              >
                {columnRequests.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div
              style={{
                padding: '0.75rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                flex: 1
              }}
            >
              {columnRequests.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 0.5rem',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    margin: 'auto 0'
                  }}
                >
                  Aucune demande
                </div>
              ) : (
                columnRequests.map((req) => (
                  <div
                    key={req._id}
                    onClick={() => onSelectRequest(req._id)}
                    className="glass-card"
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem',
                      position: 'relative',
                      borderLeft: req.priority === 'Urgente' ? '3px solid var(--danger)' : undefined
                    }}
                  >
                    {/* Top ticket code & priority */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="mono-font" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {req.ticketNumber}
                      </span>
                      <PriorityBadge priority={req.priority} size="sm" />
                    </div>

                    {/* Title */}
                    <h5
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {req.title}
                    </h5>

                    {/* Department badge */}
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontWeight: '500' }}>
                      {req.department}
                    </div>

                    {/* SLA Warning if breached */}
                    {req.slaBreached && !['Terminée', 'Archivée'].includes(req.status) && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.7rem',
                          color: '#ef4444',
                          fontWeight: '700',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          padding: '0.2rem 0.45rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <AlertTriangle size={12} />
                        <span>SLA Dépassement</span>
                      </div>
                    )}

                    {/* Footer: Requester / Assignee avatar & date */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {req.assignedTo ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title={`Assigné à : ${req.assignedTo.name}`}>
                            <img
                              src={req.assignedTo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={req.assignedTo.name}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                            />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {req.assignedTo.name.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                            Non assigné
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
