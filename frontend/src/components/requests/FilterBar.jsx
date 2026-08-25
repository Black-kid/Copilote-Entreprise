import React from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Kanban, 
  TableProperties, 
  UserCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['Créée', 'En attente', 'Assignée', 'En cours', 'Terminée', 'Archivée'];
const PRIORITY_OPTIONS = ['Basse', 'Moyenne', 'Haute', 'Urgente'];
const DEPARTMENTS = [
  'Direction Générale',
  'Technologies & SI',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Opérations & Logistique',
  'Marketing & Ventes',
  'Support & Maintenance'
];

export const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  viewMode, 
  onViewModeChange,
  totalResults = 0
}) => {
  const { user, isEmployee, isTech } = useAuth();

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      {/* Top row: Search & View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={16}
              color="var(--text-dim)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Filtrer par titre, N° ticket, mot-clé..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px' }}
            />
          </div>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)', fontWeight: '600' }}>
            {totalResults} résultat(s)
          </span>
        </div>

        {/* View Mode Switcher (Kanban vs Table) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-input)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <button
              onClick={() => onViewModeChange('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'kanban' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <Kanban size={15} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <TableProperties size={15} />
              <span>Tableau</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Multi-Criteria Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Status Dropdown */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px', height: '36px', fontSize: '0.8125rem' }}
        >
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Priority Dropdown */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '140px', height: '36px', fontSize: '0.8125rem' }}
        >
          <option value="">Toutes priorités</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Department Dropdown */}
        <select
          value={filters.department || ''}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '180px', height: '36px', fontSize: '0.8125rem' }}
        >
          <option value="">Tous départements</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Quick Role-Specific Filters */}
        {isEmployee && (
          <button
            onClick={() => onFilterChange('myOnly', filters.myOnly === 'true' ? '' : 'true')}
            className={`btn btn-sm ${filters.myOnly === 'true' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <span>Mes demandes uniquement</span>
          </button>
        )}

        {isTech && (
          <button
            onClick={() => onFilterChange('assignedOnly', filters.assignedOnly === 'true' ? '' : 'true')}
            className={`btn btn-sm ${filters.assignedOnly === 'true' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <span>Mes interventions assignées</span>
          </button>
        )}

        {/* Reset Filters */}
        {(filters.search || filters.status || filters.priority || filters.department || filters.myOnly || filters.assignedOnly) && (
          <button
            onClick={onResetFilters}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)' }}
          >
            <RotateCcw size={13} />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
    </div>
  );
};
