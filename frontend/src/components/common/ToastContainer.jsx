import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let bg = 'var(--bg-secondary)';
        let border = 'var(--border-color)';
        let Icon = Info;
        let iconColor = 'var(--info)';

        if (toast.type === 'success') {
          border = 'var(--success-border)';
          Icon = CheckCircle2;
          iconColor = 'var(--success)';
        } else if (toast.type === 'error') {
          border = 'var(--danger-border)';
          Icon = AlertCircle;
          iconColor = 'var(--danger)';
        } else if (toast.type === 'warning') {
          border = 'var(--warning-border)';
          Icon = AlertCircle;
          iconColor = 'var(--warning)';
        }

        return (
          <div
            key={toast.id}
            className="glass-card"
            style={{
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              border: `1px solid ${border}`,
              backgroundColor: bg,
              boxShadow: 'var(--shadow-lg)',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: '500' }}>
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
