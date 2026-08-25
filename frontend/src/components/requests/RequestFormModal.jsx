import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { PlusCircle, Flame, Clock, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Informatique & Réseau',
  'Matériel & Postes',
  'Logiciels & Licences',
  'Maintenance des Locaux',
  'Sécurité & Accès',
  'Logistique & Fournitures',
  'Opérations RH'
];

const PRIORITIES = [
  { key: 'Basse', label: 'Basse (SLA 72h)', color: '#94a3b8' },
  { key: 'Moyenne', label: 'Moyenne (SLA 24h)', color: '#60a5fa' },
  { key: 'Haute', label: 'Haute (SLA 12h)', color: '#f59e0b' },
  { key: 'Urgente', label: 'Urgente (SLA 4h)', color: '#ef4444' }
];

const DEPARTMENTS = [
  'Direction Générale',
  'Technologies & SI',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Opérations & Logistique',
  'Marketing & Ventes',
  'Support & Maintenance'
];

export const RequestFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState('Moyenne');
  const [department, setDepartment] = useState(user?.department || DEPARTMENTS[0]);
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [description, setDescription] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Veuillez remplir le titre et la description', 'warning');
      return;
    }

    try {
      setLoading(true);
      const tags = tagsString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await api.createRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        department,
        estimatedHours: Number(estimatedHours) || 2,
        tags
      });

      addToast('Demande créée avec succès sous le statut initial "Créée"', 'success');
      setTitle('');
      setDescription('');
      setTagsString('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast(err.message || 'Erreur lors de la création de la demande', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une nouvelle demande d'opération"
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Titre concis de la demande * :</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex : Remplacement écran poste comptabilité, Panne switch..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Row 1: Category & Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Catégorie d'opération :</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Niveau de Priorité / SLA :</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Department & Estimated Hours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Département concerné :</label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Temps estimé d'intervention (heures) :</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="form-input"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description détaillée de l'incident ou besoin * :</label>
          <textarea
            className="form-textarea"
            placeholder="Détaillez le problème rencontré, le contexte, l'urgence ou les spécifications attendues..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Mots-clés / Tags (séparés par des virgules) :</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex : Réseau, Matériel, Urgence, Comptabilité"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <PlusCircle size={16} />
            <span>{loading ? 'Création...' : 'Soumettre la demande'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
