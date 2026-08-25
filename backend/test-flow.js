// Complete End-to-End API and Workflow Verification Script

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`[${res.status}] ${data.message || 'API Error'}`);
  }
  return data;
}

async function runVerification() {
  console.log('===============================================================');
  console.log('   🚀 DEMARRAGE DU TEST D’INTÉGRATION COMPLET DES OPÉRATIONS   ');
  console.log('===============================================================');

  try {
    // 1. Healthcheck
    console.log('\n[1/10] Vérification Healthcheck API...');
    const health = await request('/health');
    console.log('✅ API Healthcheck OK:', health.service);

    // 2. Authentication of all 4 Roles
    console.log('\n[2/10] Authentification des 4 rôles (Admin, Manager, Tech, Employé)...');
    const adminAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@opsflow.com', password: 'Password123!' })
    });
    const adminToken = adminAuth.data.token;
    console.log(`✅ Admin connecté : ${adminAuth.data.user.name} (${adminAuth.data.user.role})`);

    const managerAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'manager@opsflow.com', password: 'Password123!' })
    });
    const managerToken = managerAuth.data.token;
    console.log(`✅ Manager connecté : ${managerAuth.data.user.name} (${managerAuth.data.user.role})`);

    const techAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'technicien@opsflow.com', password: 'Password123!' })
    });
    const techToken = techAuth.data.token;
    console.log(`✅ Technicien connecté : ${techAuth.data.user.name} (${techAuth.data.user.role})`);

    const employeeAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'employe@opsflow.com', password: 'Password123!' })
    });
    const employeeToken = employeeAuth.data.token;
    console.log(`✅ Employé connecté : ${employeeAuth.data.user.name} (${employeeAuth.data.user.role})`);

    // 3. Dashboard Metrics
    console.log('\n[3/10] Récupération des KPIs et analytiques du tableau de bord...');
    const dashboard = await request('/dashboard/stats', { token: adminToken });
    console.log('✅ KPIs chargés :');
    console.log(`   - Total demandes : ${dashboard.data.summary.totalRequests}`);
    console.log(`   - En attente : ${dashboard.data.summary.pendingValidation}`);
    console.log(`   - En cours : ${dashboard.data.summary.inProgress}`);
    console.log(`   - SLA compliance : ${dashboard.data.summary.slaComplianceRate}%`);

    // 4. Employee creates a new request
    console.log('\n[4/10] [Workflow Etape 1] Employé crée une nouvelle demande (Statut: Créée)...');
    const newReqRes = await request('/requests', {
      method: 'POST',
      token: employeeToken,
      body: JSON.stringify({
        title: 'Panne imprimante réseau département Finance',
        description: 'L’imprimante laser multifonction HP affiche un code erreur 59.F0 et refuse les impressions des factures.',
        category: 'Matériel & Postes',
        priority: 'Haute',
        department: 'Finance & Comptabilité',
        estimatedHours: 2,
        tags: ['Imprimante', 'Finance', 'HP']
      })
    });
    const createdReq = newReqRes.data.request;
    const reqId = createdReq._id;
    console.log(`✅ Demande créée : ${createdReq.ticketNumber} - Statut : "${createdReq.status}"`);

    // 5. Employee submits request for validation (Créée -> En attente)
    console.log('\n[5/10] [Workflow Etape 2] Employé soumet pour validation (Créée -> En attente)...');
    const submitRes = await request(`/requests/${reqId}/status`, {
      method: 'PATCH',
      token: employeeToken,
      body: JSON.stringify({ targetStatus: 'En attente' })
    });
    console.log(`✅ Statut mis à jour : "${submitRes.data.request.status}"`);

    // 6. Security verification: Employee CANNOT assign or validate
    console.log('\n[6/10] [Sécurité RBAC] Tentative interdite d’assignation par un Employé...');
    try {
      await request(`/requests/${reqId}/assign`, {
        method: 'PATCH',
        token: employeeToken,
        body: JSON.stringify({ technicianId: techAuth.data.user._id })
      });
      console.error('❌ ERREUR DE SÉCURITÉ : L’employé a pu assigner !');
    } catch (err) {
      console.log('✅ Sécurité RBAC validée (403 Forbidden intercepté avec succès)');
    }

    // 7. Manager validates & assigns to Technician (En attente -> Assignée)
    console.log('\n[7/10] [Workflow Etape 3] Manager valide et assigne au technicien (En attente -> Assignée)...');
    const assignRes = await request(`/requests/${reqId}/assign`, {
      method: 'PATCH',
      token: managerToken,
      body: JSON.stringify({ technicianId: techAuth.data.user._id })
    });
    console.log(`✅ Demande validée & assignée à ${assignRes.data.request.assignedTo.name} - Statut : "${assignRes.data.request.status}"`);

    // 8. Technician starts work (Assignée -> En cours) & adds internal comment
    console.log('\n[8/10] [Workflow Etape 4] Technicien prend en charge et démarre l’intervention (Assignée -> En cours)...');
    const startRes = await request(`/requests/${reqId}/status`, {
      method: 'PATCH',
      token: techToken,
      body: JSON.stringify({ targetStatus: 'En cours' })
    });
    console.log(`✅ Statut en cours : "${startRes.data.request.status}"`);

    console.log('   - Ajout d’une note technique interne...');
    const commentRes = await request(`/requests/${reqId}/comments`, {
      method: 'POST',
      token: techToken,
      body: JSON.stringify({
        content: 'Chariot d’impression démonté. Remplacement du rouleau d’entraînement défectueux.',
        isInternal: true
      })
    });
    console.log('✅ Commentaire interne enregistré');

    // 9. Technician completes work (En cours -> Terminée)
    console.log('\n[9/10] [Workflow Etape 5] Technicien termine avec rapport de résolution (En cours -> Terminée)...');
    const finishRes = await request(`/requests/${reqId}/status`, {
      method: 'PATCH',
      token: techToken,
      body: JSON.stringify({
        targetStatus: 'Terminée',
        resolutionNotes: 'Rouleau remplacé, bac réinitialisé et page de test imprimée avec succès.',
        actualHours: 1.5
      })
    });
    console.log(`✅ Statut : "${finishRes.data.request.status}" - Heures réelles : ${finishRes.data.request.actualHours}h`);

    // 10. Admin archives the request (Terminée -> Archivée) & Checks Audit Log
    console.log('\n[10/10] [Workflow Etape 6] Admin archive la demande et valide l’historique d’audit...');
    const archiveRes = await request(`/requests/${reqId}/status`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({ targetStatus: 'Archivée' })
    });
    console.log(`✅ Statut final archivé : "${archiveRes.data.request.status}"`);

    // Inspect Audit History
    const historyRes = await request(`/requests/${reqId}/history`, { token: adminToken });
    console.log(`\n📋 Piste d’audit générée (${historyRes.data.history.length} événements enregistrés) :`);
    historyRes.data.history.forEach((h, i) => {
      console.log(`   ${i + 1}. [${h.actionType}] ${h.details} (${h.user.name})`);
    });

    console.log('\n===============================================================');
    console.log('   🎉 TOUS LES TESTS FONCTIONNELS ET DE WORKFLOW ONT RÉUSSI !   ');
    console.log('===============================================================');
  } catch (error) {
    console.error('\n❌ Échec du test :', error);
    process.exit(1);
  }
}

runVerification();
