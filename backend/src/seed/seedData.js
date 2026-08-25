const User = require('../models/User');
const Request = require('../models/Request');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { ROLES, STATUSES, PRIORITIES, CATEGORIES, ACTION_TYPES } = require('../config/constants');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Des données existent déjà. Initialisation ignorée.');
      return;
    }

    console.log('[Seed] Initialisation des données de démonstration professionnelles...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Sophie Martin',
      email: 'admin@opsflow.com',
      password: 'Password123!',
      role: ROLES.ADMIN,
      department: 'Direction Générale',
      jobTitle: 'Directrice des Opérations & SI',
      phone: '+33 1 42 68 00 01',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });

    const managerUser = await User.create({
      name: 'Marc Dubois',
      email: 'manager@opsflow.com',
      password: 'Password123!',
      role: ROLES.MANAGER,
      department: 'Opérations & Logistique',
      jobTitle: 'Responsable Opérationnel',
      phone: '+33 1 42 68 00 02',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    });

    const techUser1 = await User.create({
      name: 'Alexandre Bernard',
      email: 'technicien@opsflow.com',
      password: 'Password123!',
      role: ROLES.TECHNICIAN,
      department: 'Support & Maintenance',
      jobTitle: 'Technicien Systèmes & Réseaux Senior',
      phone: '+33 1 42 68 00 03',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    const techUser2 = await User.create({
      name: 'Sarah Benali',
      email: 'technicien2@opsflow.com',
      password: 'Password123!',
      role: ROLES.TECHNICIAN,
      department: 'Support & Maintenance',
      jobTitle: 'Technicienne Maintenance & Infrastructure',
      phone: '+33 1 42 68 00 04',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    });

    const employeeUser1 = await User.create({
      name: 'Thomas Leroy',
      email: 'employe@opsflow.com',
      password: 'Password123!',
      role: ROLES.EMPLOYEE,
      department: 'Finance & Comptabilité',
      jobTitle: 'Analyste Financier',
      phone: '+33 1 42 68 00 05',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const employeeUser2 = await User.create({
      name: 'Camille Lambert',
      email: 'camille.lambert@opsflow.com',
      password: 'Password123!',
      role: ROLES.EMPLOYEE,
      department: 'Marketing & Ventes',
      jobTitle: 'Responsable Événementiel',
      phone: '+33 1 42 68 00 06',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    });

    console.log('[Seed] Utilisateurs de démonstration créés avec succès.');

    // 2. Create Sample Requests across all 6 workflow stages
    const now = new Date();

    // Request 1: CRÉÉE
    const reqCreee = await Request.create({
      ticketNumber: 'OPS-2026-1042',
      title: 'Demande de double écran et station d’accueil USB-C',
      description: 'Dans le cadre du traitement des bilans financiers annuels, nous avons besoin de stations double écran 27" pour l’équipe comptabilité afin d’optimiser la productivité.',
      category: CATEGORIES.HARDWARE,
      priority: PRIORITIES.MOYENNE,
      status: STATUSES.CREEE,
      department: 'Finance & Comptabilité',
      requester: employeeUser1._id,
      estimatedHours: 2,
      tags: ['Matériel', 'Comptabilité', 'Poste'],
      attachments: [
        { name: 'devis_ecrans_dell.pdf', url: 'https://example.com/docs/devis.pdf', size: '840 KB' }
      ]
    });

    await ActivityLog.create({
      request: reqCreee._id,
      user: employeeUser1._id,
      actionType: ACTION_TYPES.CREATION,
      toStatus: STATUSES.CREEE,
      details: `Demande initialisée par ${employeeUser1.name}`
    });

    // Request 2: EN ATTENTE
    const reqEnAttente = await Request.create({
      ticketNumber: 'OPS-2026-1039',
      title: 'Création d’accès VPN distant sécurisé et certificats SSL',
      description: 'L’équipe commerciale effectue un salon professionnel et a besoin d’un accès VPN d’urgence avec double authentification pour accéder aux dossiers clients.',
      category: CATEGORIES.SECURITE,
      priority: PRIORITIES.HAUTE,
      status: STATUSES.EN_ATTENTE,
      department: 'Marketing & Ventes',
      requester: employeeUser2._id,
      estimatedHours: 3,
      tags: ['Sécurité', 'VPN', 'Accès'],
      dueDate: new Date(now.getTime() + 8 * 3600 * 1000)
    });

    await ActivityLog.create({
      request: reqEnAttente._id,
      user: employeeUser2._id,
      actionType: ACTION_TYPES.STATUS_CHANGE,
      fromStatus: STATUSES.CREEE,
      toStatus: STATUSES.EN_ATTENTE,
      details: `Demande soumise pour validation hiérarchique par ${employeeUser2.name}`
    });

    // Request 3: ASSIGNÉE
    const reqAssignee = await Request.create({
      ticketNumber: 'OPS-2026-1035',
      title: 'Maintenance préventive climatisation salle serveurs Bâtiment A',
      description: 'La température mesurée dans la baie n°2 a atteint 24.5°C hier soir. Inspection requise du compresseur et remplacement préventif des filtres à poussière.',
      category: CATEGORIES.MAINTENANCE_LOCAUX,
      priority: PRIORITIES.HAUTE,
      status: STATUSES.ASSIGNEE,
      department: 'Technologies & SI',
      requester: adminUser._id,
      assignedTo: techUser2._id,
      validatedBy: managerUser._id,
      estimatedHours: 4,
      tags: ['Infrastructure', 'Datacenter', 'Clim'],
      dueDate: new Date(now.getTime() + 10 * 3600 * 1000)
    });

    await ActivityLog.create({
      request: reqAssignee._id,
      user: managerUser._id,
      actionType: ACTION_TYPES.ASSIGNMENT,
      fromStatus: STATUSES.EN_ATTENTE,
      toStatus: STATUSES.ASSIGNEE,
      details: `Validée et assignée à Sarah Benali par ${managerUser.name}`
    });

    // Request 4: EN COURS (Urgente)
    const reqEnCours = await Request.create({
      ticketNumber: 'OPS-2026-1028',
      title: 'Panne critique switch réseau 10G - Étage 3 Déconnexions',
      description: 'Le switch principal Cisco Catalyst de l’étage 3 redémarre en boucle. Plus de 35 collaborateurs sont actuellement sans connectivité Ethernet filaire.',
      category: CATEGORIES.IT_INFRASTRUCTURE,
      priority: PRIORITIES.URGENTE,
      status: STATUSES.EN_COURS,
      department: 'Support & Maintenance',
      requester: managerUser._id,
      assignedTo: techUser1._id,
      validatedBy: adminUser._id,
      estimatedHours: 2,
      actualHours: 1.5,
      tags: ['Incident Majeur', 'Réseau', 'Switch', 'Urgent'],
      dueDate: new Date(now.getTime() + 2 * 3600 * 1000)
    });

    await ActivityLog.create({
      request: reqEnCours._id,
      user: techUser1._id,
      actionType: ACTION_TYPES.STATUS_CHANGE,
      fromStatus: STATUSES.ASSIGNEE,
      toStatus: STATUSES.EN_COURS,
      details: `Intervention en cours dans le local technique 3B par ${techUser1.name}`
    });

    await Comment.create({
      request: reqEnCours._id,
      author: techUser1._id,
      content: 'Diagnostic en cours. L’alimentation redondante RPS est en défaut. Remplacement par le bloc de secours en stock.',
      isInternal: true
    });

    // Request 5: TERMINÉE
    const reqTerminee = await Request.create({
      ticketNumber: 'OPS-2026-1014',
      title: 'Migration et configuration postes de travail Microsoft 365',
      description: 'Finalisation du passage de la suite Office locale vers Microsoft 365 Business Premium pour le pôle Opérations.',
      category: CATEGORIES.SOFTWARE,
      priority: PRIORITIES.MOYENNE,
      status: STATUSES.TERMINEE,
      department: 'Opérations & Logistique',
      requester: employeeUser1._id,
      assignedTo: techUser1._id,
      validatedBy: managerUser._id,
      estimatedHours: 5,
      actualHours: 4.5,
      resolutionNotes: 'Migration terminée avec succès pour les 12 postes. Boîtes aux lettres synchronisées et OneDrive configuré.',
      tags: ['Logiciels', 'M365', 'Déploiement']
    });

    await ActivityLog.create({
      request: reqTerminee._id,
      user: techUser1._id,
      actionType: ACTION_TYPES.STATUS_CHANGE,
      fromStatus: STATUSES.EN_COURS,
      toStatus: STATUSES.TERMINEE,
      details: `Intervention clôturée par Alexandre Bernard avec rapport de résolution.`
    });

    await Comment.create({
      request: reqTerminee._id,
      author: employeeUser1._id,
      content: 'Merci beaucoup Alexandre, tout fonctionne parfaitement ce matin !',
      isInternal: false
    });

    // Request 6: ARCHIVÉE
    const reqArchivee = await Request.create({
      ticketNumber: 'OPS-2026-1002',
      title: 'Contrôle annuel des systèmes d’extinction incendie et issues',
      description: 'Audit légal de sécurité incendie semestriel réalisé avec le bureau de contrôle Apave sur les bâtiments A et B.',
      category: CATEGORIES.SECURITE,
      priority: PRIORITIES.BASSE,
      status: STATUSES.ARCHIVEE,
      department: 'Direction Générale',
      requester: adminUser._id,
      assignedTo: techUser2._id,
      validatedBy: adminUser._id,
      estimatedHours: 6,
      actualHours: 5,
      resolutionNotes: 'Rapport d’audit conforme reçu et signé. Tous les extincteurs sont certifiés jusqu’en 2027.',
      archivedAt: new Date(now.getTime() - 24 * 3600 * 1000),
      archivedBy: adminUser._id,
      tags: ['Conformité', 'Sécurité', 'Audit']
    });

    await ActivityLog.create({
      request: reqArchivee._id,
      user: adminUser._id,
      actionType: ACTION_TYPES.ARCHIVAL,
      fromStatus: STATUSES.TERMINEE,
      toStatus: STATUSES.ARCHIVEE,
      details: `Demande archivée et clôturée au registre réglementaire par ${adminUser.name}`
    });

    // 3. Create Sample Notifications
    await Notification.create({
      recipient: techUser1._id,
      sender: managerUser._id,
      title: 'Intervention d’urgence requise',
      message: 'Panne critique switch réseau 10G - Étage 3 (OPS-2026-1028)',
      type: 'ASSIGNMENT',
      relatedRequest: reqEnCours._id,
      isRead: false
    });

    await Notification.create({
      recipient: managerUser._id,
      sender: employeeUser2._id,
      title: 'Validation demandée',
      message: 'Camille Lambert a soumis une demande VPN distante (OPS-2026-1039)',
      type: 'STATUS_CHANGE',
      relatedRequest: reqEnAttente._id,
      isRead: false
    });

    await Notification.create({
      recipient: employeeUser1._id,
      sender: techUser1._id,
      title: 'Demande terminée',
      message: 'Votre demande Migration M365 (OPS-2026-1014) a été résolue.',
      type: 'STATUS_CHANGE',
      relatedRequest: reqTerminee._id,
      isRead: true
    });

    console.log('[Seed] Données de démonstration initialisées avec succès !');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

module.exports = { seedDatabase };
