import React from 'react';
import { BarChart3, PieChart, TrendingUp, Building2 } from 'lucide-react';

export const AnalyticsCharts = ({ 
  statusDistribution = {}, 
  priorityDistribution = {}, 
  departmentDistribution = {},
  activityTrend = [] 
}) => {
  const totalStatus = Object.values(statusDistribution).reduce((a, b) => a + b, 0) || 1;
  const totalPriority = Object.values(priorityDistribution).reduce((a, b) => a + b, 0) || 1;

  const STATUS_COLORS = {
    'Créée': '#818cf8',
    'En attente': '#fbbf24',
    'Assignée': '#38bdf8',
    'En cours': '#c084fc',
    'Terminée': '#34d399',
    'Archivée': '#94a3b8'
  };

  const PRIORITY_COLORS = {
    'Basse': '#94a3b8',
    'Moyenne': '#60a5fa',
    'Haute': '#f59e0b',
    'Urgente': '#ef4444'
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem'
      }}
    >
      {/* 1. Status Lifecycle Breakdown */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <PieChart size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Répartition par Étape Workflow</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
            {totalStatus} demandes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1, justifyContent: 'center' }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => {
            const count = statusDistribution[status] || 0;
            const pct = Math.round((count / totalStatus) * 100);
            return (
              <div key={status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                    {status}
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
                    {count} ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease-in-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Priority Distribution */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <BarChart3 size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Niveau de Criticité & Priorités</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
            SLA assigné
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
          {Object.entries(PRIORITY_COLORS).map(([priority, color]) => {
            const count = priorityDistribution[priority] || 0;
            const pct = Math.round((count / totalPriority) * 100);
            return (
              <div key={priority}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
                    {priority}
                  </span>
                  <span style={{ fontWeight: '700', color }}>
                    {count} tickets ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease-in-out'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Department Volume */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Building2 size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Demandes par Département</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
            Volume interne
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '200px' }}>
          {Object.entries(departmentDistribution).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '1.5rem', fontSize: '0.85rem' }}>
              Aucune donnée départementale
            </div>
          ) : (
            Object.entries(departmentDistribution).map(([dept, count]) => (
              <div
                key={dept}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-main)', fontWeight: '500' }}>
                  {dept}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    color: '#06b6d4'
                  }}
                >
                  {count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
