import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { WorkloadWidget } from '../components/dashboard/WorkloadWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { RefreshCw, Flame } from 'lucide-react';

export const DashboardPage = ({ onSelectRequest, onOpenNewRequest }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await api.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Erreur chargement dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
        <RefreshCw size={28} className="spin-animation" style={{ margin: '0 auto 1rem auto' }} />
        <p>Chargement des métriques opérationnelles...</p>
      </div>
    );
  }

  const { summary, statusDistribution, priorityDistribution, departmentDistribution, technicianWorkload, activityTrend, recentActivity } = stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Tableau de Bord des Opérations
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Supervision en temps réel des flux, interventions et indicateurs de performance SLA.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'spin-animation' : ''} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Critical / Urgent Alert Banner if urgent requests pending */}
      {summary?.urgentPending > 0 && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.18) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            animation: 'pulse-glow 3s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171'
              }}
            >
              <Flame size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f87171' }}>
                Attention Opérationnelle : {summary.urgentPending} Demande(s) Urgente(s) en attente
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Des incidents à haute priorité requièrent un traitement prioritaire sous SLA strict.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Grid */}
      <KpiGrid summary={summary} />

      {/* Analytics Distributions */}
      <AnalyticsCharts
        statusDistribution={statusDistribution}
        priorityDistribution={priorityDistribution}
        departmentDistribution={departmentDistribution}
        activityTrend={activityTrend}
      />

      {/* Bottom Row: Workload & Live Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        <WorkloadWidget technicians={technicianWorkload} />
        <RecentActivityWidget activities={recentActivity} onSelectRequest={onSelectRequest} />
      </div>
    </div>
  );
};
