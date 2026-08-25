const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ requestId, userId, actionType, fromStatus = null, toStatus = null, details, metadata = {} }) => {
  try {
    const log = await ActivityLog.create({
      request: requestId,
      user: userId,
      actionType,
      fromStatus,
      toStatus,
      details,
      metadata
    });
    return log;
  } catch (error) {
    console.error('[AuditService Error]', error.message);
    return null;
  }
};

module.exports = { logActivity };
