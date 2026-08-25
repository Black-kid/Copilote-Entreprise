import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Eye, ArrowUpDown, AlertTriangle, UserPlus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RequestTable = ({ 
  requests = [], 
  onSelectRequest, 
  onDeleteRequest,
  sortBy, 
  sortOrder, 
  onSortChange 
}) => {
  const { user, isAdmin, isManager } = useAuth();

  const handleSort = (field) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <th
                onClick={() => handleSort('ticketNumber')}
                style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>N° Ticket</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th
                onClick={() => handleSort('title')}
                style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Titre & Détails</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Statut Workflow</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th
                onClick={() => handleSort('priority')}
                style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Priorité</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Demandeur
              </th>

              <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Technicien Assigné
              </th>

              <th
                onClick={() => handleSort('createdAt')}
                style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Date</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>

              <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                  Aucune demande ne correspond à ces critères.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req._id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Ticket Number */}
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <span className="mono-font" style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {req.ticketNumber}
                    </span>
                  </td>

                  {/* Title & Department */}
                  <td style={{ padding: '1rem', maxWidth: '320px' }}>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={req.title}
                    >
                      {req.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {req.department} • {req.category}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <StatusBadge status={req.status} />
                  </td>

                  {/* Priority Badge & SLA alert */}
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <PriorityBadge priority={req.priority} size="sm" />
                      {req.slaBreached && !['Terminée', 'Archivée'].includes(req.status) && (
                        <span title="Dépassement SLA" style={{ color: '#ef4444' }}>
                          <AlertTriangle size={14} />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Requester */}
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={req.requester?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={req.requester?.name}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {req.requester?.name || 'Inconnu'}
                      </span>
                    </div>
                  </td>

                  {/* Assigned Technician */}
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                    {req.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={req.assignedTo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={req.assignedTo.name}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                        />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: '600' }}>
                          {req.assignedTo.name}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        Non assigné
                      </span>
                    )}
                  </td>

                  {/* Created At */}
                  <td style={{ padding: '1rem', fontSize: '0.775rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                    {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        onClick={() => onSelectRequest(req._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        title="Consulter les détails et le workflow"
                      >
                        <Eye size={13} />
                        <span>Détails</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onDeleteRequest && onDeleteRequest(req._id)}
                          className="btn-icon"
                          style={{ padding: '0.35rem', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}
                          title="Supprimer la demande (Admin)"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
