import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { WorkflowStepper } from '../common/WorkflowStepper';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  User, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  History, 
  MessageSquare, 
  UserCheck, 
  Send, 
  Lock, 
  AlertTriangle,
  Paperclip,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const RequestDetailModal = ({ requestId, isOpen, onClose, onRefresh }) => {
  const { user, isAdmin, isManager, isTech } = useAuth();
  const { addToast } = useNotification();

  const [requestData, setRequestData] = useState(null);
  const [allowedStatuses, setAllowedStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'history', 'comments', 'assignment'

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Technicians state
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Resolution modal state
  const [showResolutionPrompt, setShowResolutionPrompt] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actualHours, setActualHours] = useState(2);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchRequestDetails = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      const res = await api.getRequestById(requestId);
      setRequestData(res.data.request);
      setAllowedStatuses(res.data.allowedNextStatuses || []);
      setSelectedTechId(res.data.request?.assignedTo?._id || '');
    } catch (err) {
      addToast(err.message || 'Erreur lors du chargement de la demande', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!requestId) return;
    try {
      setCommentLoading(true);
      const res = await api.getComments(requestId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!requestId) return;
    try {
      setHistoryLoading(true);
      const res = await api.getActivityHistory(requestId);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await api.getTechnicians();
      setTechnicians(res.data.technicians || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRequestDetails();
      fetchComments();
      fetchHistory();
      if (isAdmin || isManager) {
        fetchTechnicians();
      }
    }
  }, [isOpen, requestId]);

  const handleStatusChangeClick = (targetStatus) => {
    if (targetStatus === 'Terminée') {
      setShowResolutionPrompt(true);
    } else {
      executeStatusTransition(targetStatus);
    }
  };

  const executeStatusTransition = async (targetStatus, notes = '', hours = 0) => {
    try {
      setStatusLoading(true);
      await api.updateRequestStatus(requestId, {
        targetStatus,
        resolutionNotes: notes,
        actualHours: hours
      });
      addToast(`Statut mis à jour avec succès : ${targetStatus}`, 'success');
      setShowResolutionPrompt(false);
      await fetchRequestDetails();
      await fetchHistory();
      if (onRefresh) onRefresh();
    } catch (err) {
      addToast(err.message || 'Erreur lors du changement de statut', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechId) {
      addToast('Veuillez sélectionner un technicien', 'warning');
      return;
    }
    try {
      setAssignLoading(true);
      await api.assignRequest(requestId, selectedTechId);
      addToast('Technicien assigné avec succès', 'success');
      await fetchRequestDetails();
      await fetchHistory();
      if (onRefresh) onRefresh();
    } catch (err) {
      addToast(err.message || 'Erreur lors de l’assignation', 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      await api.addComment(requestId, {
        content: commentText.trim(),
        isInternal: isInternalComment
      });
      setCommentText('');
      setIsInternalComment(false);
      await fetchComments();
      await fetchHistory();
      addToast('Commentaire ajouté', 'success');
    } catch (err) {
      addToast(err.message || 'Erreur ajout commentaire', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        requestData ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="mono-font" style={{ color: 'var(--primary)', fontWeight: '800' }}>
              {requestData.ticketNumber}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {requestData.title}
            </span>
          </div>
        ) : (
          'Détails de la demande'
        )
      }
      maxWidth="850px"
    >
      {loading || !requestData ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          Chargement des détails opérationnels...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Metadata Chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <StatusBadge status={requestData.status} />
              <PriorityBadge priority={requestData.priority} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                {requestData.department} • {requestData.category}
              </span>
            </div>

            {/* SLA indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {requestData.slaBreached && !['Terminée', 'Archivée'].includes(requestData.status) ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    fontWeight: '700',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>SLA Dépassé</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Clock size={14} />
                  <span>
                    Échéance :{' '}
                    {requestData.dueDate
                      ? new Date(requestData.dueDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : `${requestData.slaHours || 24}h`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Workflow Stepper & Role Transition Actions */}
          <WorkflowStepper
            currentStatus={requestData.status}
            allowedNextStatuses={allowedStatuses}
            onStatusChange={handleStatusChangeClick}
            loading={statusLoading}
          />

          {/* Resolution Prompt Sub-Modal when completing */}
          {showResolutionPrompt && (
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                <CheckCircle2 size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                  Rapport de Résolution de l'Intervention
                </h4>
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label">Notes de résolution & solutions apportées :</label>
                <textarea
                  className="form-textarea"
                  placeholder="Expliquez ce qui a été réparé, configuré ou livré..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  style={{ minHeight: '70px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Heures réelles d'intervention :</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="form-input"
                    value={actualHours}
                    onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button
                    onClick={() => setShowResolutionPrompt(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => executeStatusTransition('Terminée', resolutionNotes, actualHours)}
                    disabled={statusLoading}
                    className="btn btn-success btn-sm"
                  >
                    Valider la clôture
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '0.5rem'
            }}
          >
            {[
              { id: 'details', label: 'Détails & Diagnostic', icon: FileText },
              { id: 'history', label: `Historique & Audit (${history.length})`, icon: History },
              { id: 'comments', label: `Discussion (${comments.length})`, icon: MessageSquare },
              ...(isAdmin || isManager ? [{ id: 'assignment', label: 'Affectation Technicien', icon: UserCheck }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description de la Demande
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {requestData.description}
                </p>
              </div>

              {requestData.resolutionNotes && (
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: '0.35rem', fontWeight: '700' }}>
                    Rapport de Résolution / Solution
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {requestData.resolutionNotes}
                  </p>
                </div>
              )}

              {/* People & Hours Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Demandeur :</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <img
                      src={requestData.requester?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt=""
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {requestData.requester?.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {requestData.requester?.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Technicien Assigné :</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {requestData.assignedTo ? (
                      <>
                        <img
                          src={requestData.assignedTo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt=""
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {requestData.assignedTo.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            {requestData.assignedTo.jobTitle || 'Technicien'}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                        Aucun technicien affecté
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Temps d'intervention :</span>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                    Estimé : {requestData.estimatedHours}h | Réel : {requestData.actualHours || 0}h
                  </div>
                </div>
              </div>

              {/* Tags & Attachments */}
              {requestData.tags && requestData.tags.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Mots-clés :</span>
                  {requestData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
              {historyLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  Chargement du journal d'audit...
                </div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                  Aucun historique disponible.
                </div>
              ) : (
                history.map((log) => (
                  <div
                    key={log._id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <img
                      src={log.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt=""
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {log.user?.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {new Date(log.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {log.details}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: COMMENTS & INTERNAL NOTES */}
          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    Aucun message pour l'instant. Démarrez la discussion ci-dessous.
                  </div>
                ) : (
                  comments.map((cmt) => (
                    <div
                      key={cmt._id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: cmt.isInternal ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${cmt.isInternal ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img
                            src={cmt.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                            alt=""
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {cmt.author?.name}
                          </span>
                          {cmt.isInternal && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                color: '#f59e0b',
                                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '700'
                              }}
                            >
                              Note Interne
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {new Date(cmt.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        {cmt.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea
                  className="form-textarea"
                  placeholder="Écrire une mise à jour ou poser une question..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ minHeight: '60px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {(isAdmin || isManager || isTech) ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                      />
                      <Lock size={12} color="#f59e0b" />
                      <span>Note interne réservée aux techniciens/managers</span>
                    </label>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <Send size={13} />
                    <span>Envoyer</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: TECHNICIAN ASSIGNMENT (Manager/Admin Only) */}
          {activeTab === 'assignment' && (isAdmin || isManager) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Affecter ou Réassigner à un Technicien
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Sélectionnez un technicien qualifié disponible pour prendre en charge cette opération.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Sélectionner un technicien :</label>
                <select
                  className="form-select"
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                >
                  <option value="">-- Choisir un intervenant --</option>
                  {technicians.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.jobTitle || 'Technicien'}) — {t.activeTasks || 0} tâche(s) active(s)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssignTechnician}
                disabled={assignLoading || !selectedTechId}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                <UserCheck size={16} />
                <span>Confirmer l'assignation</span>
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
