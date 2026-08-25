import React from 'react';
import { Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const WorkloadWidget = ({ technicians = [] }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Wrench size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Charge de Travail des Techniciens</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Disponibilité opérationnelle
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {technicians.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
            Aucun technicien actif répertorié.
          </div>
        ) : (
          technicians.map((tech) => {
            const isHighLoad = tech.activeTasks >= 3;
            return (
              <div
                key={tech._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={tech.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={tech.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {tech.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {tech.jobTitle || 'Technicien'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700', color: isHighLoad ? 'var(--danger)' : 'var(--primary)' }}>
                      {tech.activeTasks} en cours
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {tech.completedTasks} résolue(s)
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      backgroundColor: isHighLoad ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: isHighLoad ? 'var(--danger)' : 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {isHighLoad ? (
                      <>
                        <AlertTriangle size={12} />
                        Saturé
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        Disponible
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
