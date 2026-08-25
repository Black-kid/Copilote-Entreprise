# CoPilote Entreprise

**CoPilote Entreprise** est une application web de gestion des demandes et des opérations informatiques au sein d'une entreprise.

L'objectif du projet est de proposer un espace centralisé permettant aux employés de déclarer leurs besoins, aux managers de les valider et de les affecter, puis aux techniciens de suivre et résoudre les interventions.

J'ai conçu le projet comme une application **Full Stack**, avec un frontend React, une API REST Node.js/Express et une base de données MongoDB.

---

## 🎯 Pourquoi ce projet ?

Dans une entreprise, les demandes informatiques peuvent rapidement devenir difficiles à suivre lorsqu'elles sont gérées uniquement par des mails, des messages ou des fichiers dispersés.

**CoPilote Entreprise** cherche à résoudre ce problème en regroupant les demandes dans une même plateforme et en permettant de suivre leur évolution depuis leur création jusqu'à leur résolution.

Chaque demande possède un statut, une priorité, un responsable et un historique des actions effectuées.

---

## ✨ Ce que l'application permet de faire

### 👤 Gestion des utilisateurs

L'application fonctionne avec plusieurs rôles afin que chaque utilisateur dispose des permissions adaptées à ses responsabilités :

* **Employé** : création et suivi de ses demandes
* **Manager** : validation et affectation des demandes
* **Technicien** : prise en charge et résolution des interventions
* **Administrateur** : supervision et administration globale

Les accès sont contrôlés côté backend grâce à un système **RBAC (Role-Based Access Control)**.

---

### 🎫 Gestion des demandes

Une demande peut contenir notamment :

* Un titre et une description
* Une catégorie
* Une priorité
* Un département
* Une estimation du temps nécessaire
* Des tags
* Un technicien assigné
* Des commentaires
* Des informations de résolution

Les demandes peuvent être consultées sous différentes formes, notamment en **tableau** ou en **Kanban**, avec des filtres permettant de retrouver plus facilement les tickets.

---

## 🔄 Workflow d'une demande

J'ai mis en place un workflow permettant de suivre chaque demande étape par étape :

```text
Créée
   ↓
En attente
   ↓
Assignée
   ↓
En cours
   ↓
Terminée
   ↓
Archivée
```

Chaque changement de statut est contrôlé par le backend en fonction du rôle de l'utilisateur.

Par exemple, un employé peut créer une demande et la soumettre pour validation, mais il ne peut pas l'affecter directement à un technicien.

---

## 📊 Tableau de bord

Le dashboard permet d'avoir une vue globale de l'activité.

Il présente notamment :

* Le nombre total de demandes
* Les demandes en attente
* Les demandes en cours
* Le taux de conformité SLA
* L'activité récente
* La charge de travail
* Des graphiques d'analyse

L'objectif est de permettre aux responsables de comprendre rapidement la situation opérationnelle.

---

## 🔔 Notifications et historique

L'application possède également un système de notifications permettant d'informer les utilisateurs des événements importants.

Chaque demande possède également un historique permettant de garder une trace des différentes actions effectuées.

Cette partie est particulièrement importante pour assurer la **traçabilité des opérations**.

---

# 🛠️ Technologies utilisées

### Frontend

* React
* Vite
* React DOM
* Lucide React
* Oxlint

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* express-validator
* dotenv
* CORS

### Architecture

Le projet est organisé autour d'une séparation claire entre le frontend et le backend.

```text
Frontend
React + Vite
     │
     │ REST API
     ▼
Backend
Node.js + Express
     │
     ├── Controllers
     ├── Routes
     ├── Middlewares
     └── Services
     │
     ▼
MongoDB
```

---

# 📁 Structure du projet

```text
Copilote-Entreprise/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       ├── services/
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Black-kid/Copilote-Entreprise.git
cd Copilote-Entreprise
```

### 2. Installer le backend

```bash
cd backend
npm install
```

Configurer ensuite les variables d'environnement nécessaires à la connexion MongoDB et à l'authentification JWT.

Puis lancer le serveur :

```bash
npm run dev
```

### 3. Installer le frontend

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

---

# 🧪 Vérification du fonctionnement

Le projet possède un scénario de test d'intégration situé dans :

```text
backend/test-flow.js
```

Ce test vérifie le fonctionnement global de l'application à travers un scénario complet :

```text
Connexion
   ↓
Création d'une demande
   ↓
Validation
   ↓
Affectation
   ↓
Intervention
   ↓
Résolution
   ↓
Archivage
   ↓
Vérification de l'audit
```

Le test vérifie également les permissions entre les différents rôles.

---

# 🔐 Sécurité

La sécurité fait partie des éléments importants du projet.

L'application utilise notamment :

* **JWT** pour l'authentification
* **bcryptjs** pour le hachage des mots de passe
* **RBAC** pour les permissions
* Middleware d'authentification
* Validation des données
* Gestion des erreurs
* Journalisation des actions importantes

Les fichiers contenant des informations sensibles, comme `.env`, sont exclus du dépôt Git.

---

# 📸 Captures d'écran

Des captures de l'application seront ajoutées ici pour présenter les principales interfaces :

* Page de connexion
* Dashboard
* Liste des demandes
* Vue Kanban
* Détail d'une demande
* Notifications
* Gestion des utilisateurs

---

# 💡 Ce que ce projet m'a permis de mettre en pratique

À travers **CoPilote Entreprise**, j'ai pu travailler sur plusieurs aspects du développement Full Stack :

* Développement d'interfaces avec React
* Création d'une API REST avec Express
* Conception de modèles MongoDB avec Mongoose
* Authentification JWT
* Gestion des rôles et permissions
* Conception d'un workflow métier
* Gestion des notifications
* Mise en place d'une piste d'audit
* Tests d'intégration
* Organisation d'un projet Full Stack
* Utilisation de Git et GitHub

---

## 👨‍💻 À propos

**CoPilote Entreprise** est un projet personnel réalisé pour mettre en pratique mes compétences en développement web Full Stack et en conception d'applications orientées gestion et opérations IT.

Le projet continue d'évoluer avec l'amélioration de l'interface, l'ajout de fonctionnalités et le renforcement des tests.

**Auteur : RAMIANDRISOA Fetrarivo Chris**
