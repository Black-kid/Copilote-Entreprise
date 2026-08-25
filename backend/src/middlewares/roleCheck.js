const { ROLES } = require('../config/constants');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès interdit. Votre rôle (${req.user.role}) n'a pas les autorisations nécessaires pour cette action. Rôles requis : ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};

module.exports = { authorize, ROLES };
