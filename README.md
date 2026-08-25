# CoPilote Entreprise — Plateforme Full Stack de Gestion des Opérations d'Entreprise

Application web Full Stack professionnelle, moderne et réactive conçue pour la gestion, la validation hiérarchique, l'assignation et le suivi des demandes et opérations de service en entreprise.

> 🤝 **CoPilote Entreprise** — *Votre allié au quotidien pour toutes vos opérations internes.*

---

## 🌟 Fonctionnalités Principales

### 1. Cycle de Vie & Workflow Métier (6 étapes)
- **Créée** : Demande initialisée par un employé ou manager.
- **En attente** : Soumise pour examen et arbitrage hiérarchique.
- **Assignée** : Validée par un Manager ou Administrateur et affectée à un Technicien compétent.
- **En cours** : Intervention active sur le terrain ou les systèmes.
- **Terminée** : Intervention résolue avec rapport de solution et saisie des heures passées.
- **Archivée** : Clôture formelle et conservation dans le registre d'audit légal.

### 2. Matrice de Sécurité & Rôles (RBAC)
- 👑 **Administrateur** : Supervise l'ensemble du système, gère les utilisateurs/départements, peut forcer les transitions et archiver.
- 👔 **Manager** : Valide les demandes, les priorise, les assigne aux techniciens et suit la performance de l'équipe.
- 🔧 **Technicien** : Consulte ses interventions assignées, démarre les travaux, ajoute des notes techniques internes et clôture avec résolution.
- 👤 **Employé** : Crée des demandes de service, suit leur progression en temps réel et échange via l'espace de discussion.

### 3. Tableaux de Bord & Analytiques en Temps Réel
- Cartes KPI dynamiques (Total demandes, En attente, En cours, Taux de respect SLA, Urgences actives, Temps moyen de résolution).
- Graphiques de répartition par étape de workflow, par niveau de criticité et par département.
- Widget de disponibilité et charge de travail des techniciens en temps réel.
- Journal d'audit et flux d'activité en direct.

### 4. Hub des Demandes & Vues Flexibles
- **Vue Kanban Interactive** : Colonnes dédiées pour chaque étape avec indicateurs visuels et alertes de dépassement SLA.
- **Vue Tableau de Données** : Tri multi-colonnes, filtres avancés par statut, priorité, département, recherche instantanée et pagination.
- **Fiche Détaillée & Stepper de Workflow** : Visualiseur horizontal étape par étape avec boutons d'action contextuels selon votre rôle.
- **Piste d'Audit & Traçabilité (Audit Trail)** : Historique chronologique immuable de chaque modification avec horodatage et auteur.
- **Discussion & Notes Internes** : Échange collaboratif avec distinction visuelle des notes internes réservées aux équipes techniques.

### 5. Design Moderne & Expérience Utilisateur
- Système de design sur-mesure avec mode **Sombre** (Dark Slate/Navy) et mode **Clair** (Light).
- Badges lumineux néon et animations de pulsation pour les incidents critiques.
- Centre de notifications avec compteur d'alertes non lues.
- **Bascule Rapide de Rôles Démo (1-Clic)** pour tester instantanément l'application sous n'importe quelle casquette.

---

## 🛠️ Stack Technique

- **Frontend** : React 19 + Vite, Lucide React, Design System CSS personnalisé (Variables CSS, Glassmorphism, animations fluides).
- **Backend** : Node.js + Express.js, architecture modulaire en couches (`controllers`, `services`, `models`, `routes`, `middlewares`).
- **Base de Données** : MongoDB avec Mongoose ODM (avec serveur mémoire intégré `MongoMemoryServer` pour un démarrage instantané zéro-configuration).
- **Sécurité** : JSON Web Token (JWT Bearer), chiffrement de mots de passe `bcryptjs`, validation `express-validator`.

---

## 👥 Profils de Démonstration Préconfigurés

| Rôle | Nom | Email | Mot de passe |
| :--- | :--- | :--- | :--- |
| **Administrateur** | Sophie Martin | `admin@opsflow.com` | `Password123!` |
| **Manager** | Marc Dubois | `manager@opsflow.com` | `Password123!` |
| **Technicien** | Alexandre Bernard | `technicien@opsflow.com` | `Password123!` |
| **Employé** | Thomas Leroy | `employe@opsflow.com` | `Password123!` |

> 💡 *Des boutons "1-Clic Démo" sont intégrés sur la page de connexion et dans la barre de navigation pour changer de profil instantanément.*

---

## 🚀 Démarrage Rapide

### 1. Démarrer le Backend
```bash
cd backend
npm install
npm start
```
*Le serveur démarrera sur **http://localhost:5000/api***

### 2. Démarrer le Frontend
```bash
cd frontend
npm install
npm run dev
```
*L'application sera accessible sur **http://localhost:5173/***

---

## 🧪 Lancer les Tests d'Intégration
```bash
cd backend
node test-flow.js
```

---

## 📚 Documentation Technique et Fonctionnelle Approfondie

Pour une explication exhaustive de l'architecture logicielle, de la matrice complète des rôles et permissions, de la justification des technologies et du fonctionnement détaillé de chaque module opérationnel, consultez :

👉 **[DOC_TECHNIQUE_ET_FONCTIONNELLE.md](file:///e:/Chris/Projet/DOC_TECHNIQUE_ET_FONCTIONNELLE.md)**

### Sommaire du Document :
1. **Introduction & But du Projet** : Contexte, vision organisationnelle et objectifs de centralisation opérationnelle.
2. **Rôles et Matrice des Permissions (RBAC)** : Droits d'accès et responsabilités d'Administrateur, Manager, Technicien et Employé.
3. **Explication des Technologies Utilisées** : React, Vite, CSS Personnalisé / Glassmorphism, Node.js, Express, MongoDB (avec MongoMemoryServer hybride), JWT et Bcrypt.
4. **Fonctionnalités Détaillées** : Workflow à 6 étapes, Dashboard KPI temps réel, Hub Kanban & Tableau, Stepper visuel, Piste d'audit, SLA et Discussion interne/publique.
5. **Structure Complète du Code Source**.

