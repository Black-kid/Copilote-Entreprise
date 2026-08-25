const User = require('../models/User');
const { verifyToken } = require('../config/jwt');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Jeton d’authentification manquant.'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable pour ce jeton.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte utilisateur a été désactivé.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Jeton invalide ou expiré.',
      error: error.message
    });
  }
};

module.exports = { authenticate };
