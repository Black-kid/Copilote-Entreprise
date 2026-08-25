const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/opsflow_db';
  
  try {
    // Try connecting to primary MongoDB instance with a short timeout
    console.log(`[DB] Tentative de connexion à MongoDB : ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[DB] Connecté avec succès au serveur MongoDB local/distant (${primaryUri})`);
    return mongoose.connection;
  } catch (primaryErr) {
    console.warn(`[DB] Serveur MongoDB standard inaccessible (${primaryErr.message}).`);
    console.log('[DB] Démarrage du serveur MongoDB en mémoire intégré (MongoMemoryServer)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connecté avec succès à MongoDB En-Mémoire (${memoryUri})`);
      return mongoose.connection;
    } catch (memErr) {
      console.error('[DB] Échec critique de connexion à MongoDB :', memErr);
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[DB] Connexion MongoDB fermée proprement.');
  } catch (err) {
    console.error('[DB] Erreur lors de la fermeture de la base :', err);
  }
};

module.exports = {
  connectDB,
  closeDB
};
