import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { FilterBar } from '../components/requests/FilterBar';
import { RequestKanban } from '../components/requests/RequestKanban';
import { RequestTable } from '../components/requests/RequestTable';
import { RequestDetailModal } from '../components/requests/RequestDetailModal';
import { RequestFormModal } from '../components/requests/RequestFormModal';
import { useNotification } from '../context/NotificationContext';
import { PlusCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export const RequestsPage = ({ 
  initialStatusFilter = '', 
  selectedRequestId = null, 
  onCloseSelectedRequest,
  onOpenNewRequest,
  isNewRequestModalOpen,
  onCloseNewRequestModal
}) => {
  const { addToast } = useNotification();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [detailModalId, setDetailModalId] = useState(selectedRequestId);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: initialStatusFilter || '',
    priority: '',
    department: '',
    myOnly: '',
    assignedOnly: '',
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });

  // Sync external filter changes
  useEffect(() => {
    if (initialStatusFilter !== undefined) {
      setFilters(prev => ({ ...prev, status: initialStatusFilter, page: 1 }));
    }
  }, [initialStatusFilter]);

  // Sync external selected request ID
  useEffect(() => {
    if (selectedRequestId) {
      setDetailModalId(selectedRequestId);
    }
  }, [selectedRequestId]);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getRequests(filters);
      setRequests(res.data.requests || []);
      setPagination(res.data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      addToast(err.message || 'Erreur lors du chargement des demandes', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      department: '',
      myOnly: '',
      assignedOnly: '',
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette demande ?')) return;
    try {
      await api.deleteRequest(id);
      addToast('Demande supprimée avec succès', 'success');
      loadRequests();
    } catch (err) {
      addToast(err.message || 'Erreur suppression demande', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Gestion des Opérations & Demandes
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Suivez, validez, assignez et pilotez l'ensemble des interventions du cycle opérationnel.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={loadRequests}
            disabled={loading}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={onOpenNewRequest}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} />
            <span>Créer une demande</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={pagination.total}
      />

      {/* Main View: Kanban or Table */}
      {loading && requests.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          <RefreshCw size={28} className="spin-animation" style={{ margin: '0 auto 1rem auto' }} />
          <p>Chargement des demandes en cours...</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <RequestKanban
          requests={requests}
          onSelectRequest={(id) => setDetailModalId(id)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RequestTable
            requests={requests}
            onSelectRequest={(id) => setDetailModalId(id)}
            onDeleteRequest={handleDeleteRequest}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} demandes)
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, pagination.page - 1))}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft size={14} />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, pagination.page + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Suivant</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Modal Drawer */}
      {detailModalId && (
        <RequestDetailModal
          requestId={detailModalId}
          isOpen={Boolean(detailModalId)}
          onClose={() => {
            setDetailModalId(null);
            if (onCloseSelectedRequest) onCloseSelectedRequest();
          }}
          onRefresh={loadRequests}
        />
      )}

      {/* New Request Creation Modal */}
      {isNewRequestModalOpen && (
        <RequestFormModal
          isOpen={isNewRequestModalOpen}
          onClose={onCloseNewRequestModal}
          onSuccess={loadRequests}
        />
      )}
    </div>
  );
};
