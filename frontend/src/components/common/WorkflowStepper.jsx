import React from 'react';
import { 
  FilePlus, 
  Clock, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  Archive,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { key: 'Créée', label: '1. Créée', desc: 'Demande initiée', icon: FilePlus },
  { key: 'En attente', label: '2. En attente', desc: 'Validation requise', icon: Clock },
  { key: 'Assignée', label: '3. Assignée', desc: 'Affectée à un technicien', icon: UserCheck },
  { key: 'En cours', label: '4. En cours', desc: 'Intervention active', icon: PlayCircle },
  { key: 'Terminée', label: '5. Terminée', desc: 'Résolution validée', icon: CheckCircle2 },
  { key: 'Archivée', label: '6. Archivée', desc: 'Clôture & historique', icon: Archive }
];

export const WorkflowStepper = ({ currentStatus, allowedNextStatuses = [], onStatusChange, loading = false }) => {
  const currentIndex = WORKFLOW_STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          Cycle de vie opérationnel (Workflow)
        </h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Étape {currentIndex + 1} sur 6
        </span>
      </div>

      {/* Horizontal Steps Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', position: 'relative' }}>
        {WORKFLOW_STEPS.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isNext = allowedNextStatuses.includes(step.key);
          const Icon = step.icon;

          let bg = 'rgba(255, 255, 255, 0.03)';
          let borderColor = 'var(--border-color)';
          let textColor = 'var(--text-dim)';
          let iconColor = 'var(--text-dim)';

          if (isPassed) {
            bg = 'rgba(16, 185, 129, 0.08)';
            borderColor = 'rgba(16, 185, 129, 0.3)';
            textColor = 'var(--text-main)';
            iconColor = 'var(--success)';
          } else if (isCurrent) {
            bg = 'rgba(99, 102, 241, 0.18)';
            borderColor = 'var(--primary)';
            textColor = '#ffffff';
            iconColor = 'var(--primary)';
          } else if (isNext) {
            bg = 'rgba(245, 158, 11, 0.1)';
            borderColor = 'rgba(245, 158, 11, 0.4)';
            textColor = 'var(--warning)';
            iconColor = 'var(--warning)';
          }

          return (
            <div
              key={step.key}
              style={{
                background: bg,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.35rem',
                transition: 'var(--transition)',
                boxShadow: isCurrent ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? 'var(--primary)' : isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: isCurrent ? '#ffffff' : iconColor
                }}
              >
                <Icon size={14} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: isCurrent ? '700' : '600', color: textColor }}>
                {step.label}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: '1.2' }}>
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Allowed Transitions Action Bar */}
      {allowedNextStatuses.length > 0 && onStatusChange && (
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Actions autorisées pour votre rôle :
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allowedNextStatuses.map(status => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                disabled={loading}
                className="btn btn-sm btn-primary"
                style={{
                  background: status === 'Terminée' 
                    ? 'var(--success)' 
                    : status === 'Archivée'
                    ? 'rgba(255,255,255,0.1)'
                    : undefined
                }}
              >
                <span>Passer à : {status}</span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
