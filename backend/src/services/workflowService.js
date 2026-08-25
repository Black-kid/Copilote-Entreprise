const { STATUSES, ROLES } = require('../config/constants');

// Transition matrix defining valid targets from each status
const ALLOWED_TRANSITIONS = {
  [STATUSES.CREEE]: [STATUSES.EN_ATTENTE],
  [STATUSES.EN_ATTENTE]: [STATUSES.ASSIGNEE, STATUSES.CREEE],
  [STATUSES.ASSIGNEE]: [STATUSES.EN_COURS, STATUSES.EN_ATTENTE],
  [STATUSES.EN_COURS]: [STATUSES.TERMINEE, STATUSES.ASSIGNEE],
  [STATUSES.TERMINEE]: [STATUSES.ARCHIVEE, STATUSES.EN_COURS],
  [STATUSES.ARCHIVEE]: [] // Final closed state
};

// Check if a transition is valid and if the user has appropriate permissions
const canTransition = (currentStatus, targetStatus, user, isRequester, isAssigned) => {
  // If target is same as current, no change
  if (currentStatus === targetStatus) return { allowed: false, reason: "La demande est déjà dans ce statut." };

  const validTargets = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!validTargets.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Transition impossible de '${currentStatus}' vers '${targetStatus}'. Le workflow autorisé est : Créée → En attente → Assignée → En cours → Terminée → Archivée.`
    };
  }

  const role = user.role;

  // Rule 1: CREEE -> EN_ATTENTE (Soumission pour validation)
  if (currentStatus === STATUSES.CREEE && targetStatus === STATUSES.EN_ATTENTE) {
    if (isRequester || role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul le demandeur ou un responsable peut soumettre la demande en attente de validation." };
  }

  // Rule 2: EN_ATTENTE -> ASSIGNEE (Validation et Assignation)
  if (currentStatus === STATUSES.EN_ATTENTE && targetStatus === STATUSES.ASSIGNEE) {
    if (role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul un Administrateur ou un Manager peut valider et assigner une demande." };
  }

  // Rule 3: EN_ATTENTE -> CREEE (Rejet / Demande de modification)
  if (currentStatus === STATUSES.EN_ATTENTE && targetStatus === STATUSES.CREEE) {
    if (role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul un Administrateur ou un Manager peut renvoyer la demande pour modifications." };
  }

  // Rule 4: ASSIGNEE -> EN_COURS (Prise en charge)
  if (currentStatus === STATUSES.ASSIGNEE && targetStatus === STATUSES.EN_COURS) {
    if (isAssigned || role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul le technicien assigné, un Manager ou un Administrateur peut démarrer l'intervention." };
  }

  // Rule 5: EN_COURS -> TERMINEE (Finalisation de l'intervention)
  if (currentStatus === STATUSES.EN_COURS && targetStatus === STATUSES.TERMINEE) {
    if (isAssigned || role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul le technicien assigné ou un responsable peut marquer l'intervention comme terminée." };
  }

  // Rule 6: TERMINEE -> ARCHIVEE (Archivage final)
  if (currentStatus === STATUSES.TERMINEE && targetStatus === STATUSES.ARCHIVEE) {
    if (role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul un Administrateur ou un Manager peut archiver une demande terminée." };
  }

  // Rule 7: TERMINEE -> EN_COURS (Réouverture)
  if (currentStatus === STATUSES.TERMINEE && targetStatus === STATUSES.EN_COURS) {
    if (isRequester || role === ROLES.ADMIN || role === ROLES.MANAGER) {
      return { allowed: true };
    }
    return { allowed: false, reason: "Seul le demandeur ou un responsable peut réouvrir une demande." };
  }

  return { allowed: false, reason: "Action non autorisée par le protocole de workflow." };
};

const getNextAllowedStatuses = (currentStatus, user, isRequester, isAssigned) => {
  const possible = ALLOWED_TRANSITIONS[currentStatus] || [];
  return possible.filter(target => canTransition(currentStatus, target, user, isRequester, isAssigned).allowed);
};

module.exports = {
  ALLOWED_TRANSITIONS,
  canTransition,
  getNextAllowedStatuses
};
