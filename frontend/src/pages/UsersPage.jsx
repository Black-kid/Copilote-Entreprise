import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Edit2
} from 'lucide-react';

const ROLES_LIST = ['Administrateur', 'Manager', 'Technicien', 'Employé'];
const DEPARTMENTS = [
  'Direction Générale',
  'Technologies & SI',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Opérations & Logistique',
  'Marketing & Ventes',
  'Support & Maintenance'
];

export const UsersPage = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const { addToast } = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Create/Edit User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employé',
    department: 'Support & Maintenance',
    jobTitle: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getUsers({
        search,
        role: roleFilter,
        department: departmentFilter
      });
      setUsers(res.data.users || []);
    } catch (err) {
      addToast(err.message || 'Erreur chargement utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, departmentFilter, addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Employé',
      department: 'Support & Maintenance',
      jobTitle: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      department: u.department,
      jobTitle: u.jobTitle || '',
      phone: u.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      addToast('Statut utilisateur modifié', 'success');
      loadUsers();
    } catch (err) {
      addToast(err.message || 'Erreur mise à jour statut', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingUser) {
        await api.updateUser(editingUser._id, formData);
        addToast('Utilisateur mis à jour avec succès', 'success');
      } else {
        await api.createUser(formData);
        addToast('Nouvel utilisateur créé avec succès', 'success');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      addToast(err.message || 'Erreur lors de l’enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Gestion des Utilisateurs & Équipes
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Supervisez les comptes collaborateurs, leurs habilitations de rôles (RBAC) et départements.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={loadUsers} disabled={loading} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            <span>Actualiser</span>
          </button>

          {isAdmin && (
            <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
              <UserPlus size={15} />
              <span>Ajouter un utilisateur</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Rechercher par nom, email, fonction..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px' }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px', height: '38px' }}
        >
          <option value="">Tous les rôles</option>
          {ROLES_LIST.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '180px', height: '38px' }}
        >
          <option value="">Tous départements</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* User Directory Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Collaborateur
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Rôle Habilité
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Département
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Statut
                </th>
                <th style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {u.email} {u.jobTitle ? `• ${u.jobTitle}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span className={`role-badge role-${u.role?.toLowerCase().slice(0, 5)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {u.department}
                    </td>

                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: u.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: u.isActive ? 'var(--success)' : 'var(--danger)'
                        }}
                      >
                        {u.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {u.isActive ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.6rem' }}
                            title="Modifier les infos"
                          >
                            <Edit2 size={13} />
                            <span>Modifier</span>
                          </button>

                          {u._id !== currentUser._id && (
                            <button
                              onClick={() => handleToggleStatus(u._id)}
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '0.35rem 0.6rem',
                                color: u.isActive ? 'var(--danger)' : 'var(--success)'
                              }}
                            >
                              {u.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? 'Modifier le profil collaborateur' : 'Créer un nouveau collaborateur'}
          maxWidth="550px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Nom complet * :</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse Email * :</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={Boolean(editingUser)}
                required
              />
            </div>

            {!editingUser && (
              <div className="form-group">
                <label className="form-label">Mot de passe initial * :</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 caractères"
                  required
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rôle attribué :</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Département :</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Intitulé de poste :</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Technicien Réseau, Analyste..."
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? 'Enregistrement...' : editingUser ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
