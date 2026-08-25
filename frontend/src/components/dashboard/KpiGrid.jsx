import React from 'react';
import { 
  Layers, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  TrendingUp,
  Percent
} from 'lucide-react';

export const KpiGrid = ({ summary = {} }) => {
  const KPIS = [
    {
      title: 'Total Demandes',
      value: summary.totalRequests || 0,
      subtext: 'Toutes catégories confondues',
      icon: Layers,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: 'En Attente de Validation',
      value: summary.pendingValidation || 0,
      subtext: 'Nécessite arbitrage Manager/Admin',
      icon: Clock,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)'
    },
    {
      title: 'Interventions en Cours',
      value: summary.inProgress || 0,
      subtext: 'Assignées ou en traitement terrain',
      icon: PlayCircle,
      color: '#a855f7',
      bgGlow: 'rgba(168, 85, 247, 0.15)'
    },
    {
      title: 'Taux Respect SLA',
      value: `${summary.slaComplianceRate || 100}%`,
      subtext: `${summary.slaBreachedActive || 0} dépassement(s) détecté(s)`,
      icon: Percent,
      color: summary.slaComplianceRate < 80 ? '#ef4444' : '#10b981',
      bgGlow: summary.slaComplianceRate < 80 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'Urgences Actives',
      value: summary.urgentPending || 0,
      subtext: 'Priorité Urgente non clôturée',
      icon: Flame,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.2)'
    },
    {
      title: 'Temps Moyen Résolution',
      value: `${summary.avgResolutionHours || 3.5} h`,
      subtext: 'Délai moyen d’intervention',
      icon: TrendingUp,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}
    >
      {KPIS.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient background glow */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: kpi.bgGlow,
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                {kpi.title}
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: kpi.bgGlow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: kpi.color
                }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                {kpi.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
