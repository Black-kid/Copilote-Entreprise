// Constants & Enums for OpsFlow Enterprise

const ROLES = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
  TECHNICIAN: 'Technicien'
};

const STATUSES = {
  CREEE: 'Créée',
  EN_ATTENTE: 'En attente',
  ASSIGNEE: 'Assignée',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  ARCHIVEE: 'Archivée'
};

const PRIORITIES = {
  BASSE: 'Basse',
  MOYENNE: 'Moyenne',
  HAUTE: 'Haute',
  URGENTE: 'Urgente'
};

const CATEGORIES = {
  IT_INFRASTRUCTURE: 'Informatique & Réseau',
  HARDWARE: 'Matériel & Postes',
  SOFTWARE: 'Logiciels & Licences',
  MAINTENANCE_LOCAUX: 'Maintenance des Locaux',
  SECURITE: 'Sécurité & Accès',
  LOGISTIQUE: 'Logistique & Fournitures',
  RH_OPERATIONS: 'Opérations RH'
};

const DEPARTMENTS = [
  'Direction Générale',
  'Technologies & SI',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Opérations & Logistique',
  'Marketing & Ventes',
  'Support & Maintenance'
];

const ACTION_TYPES = {
  CREATION: 'CREATION',
  STATUS_CHANGE: 'STATUS_CHANGE',
  ASSIGNMENT: 'ASSIGNMENT',
  PRIORITY_CHANGE: 'PRIORITY_CHANGE',
  COMMENT_ADDED: 'COMMENT_ADDED',
  UPDATE: 'UPDATE',
  RESOLUTION: 'RESOLUTION',
  ARCHIVAL: 'ARCHIVAL'
};

module.exports = {
  ROLES,
  STATUSES,
  PRIORITIES,
  CATEGORIES,
  DEPARTMENTS,
  ACTION_TYPES
};
