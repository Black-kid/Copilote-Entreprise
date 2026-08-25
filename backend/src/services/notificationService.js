const Notification = require('../models/Notification');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

const notifyUser = async ({ recipientId, senderId = null, title, message, type = 'SYSTEM', requestId = null }) => {
  try {
    if (!recipientId) return null;
    return await Notification.create({
      recipient: recipientId,
      sender: senderId,
      title,
      message,
      type,
      relatedRequest: requestId
    });
  } catch (error) {
    console.error('[NotificationService Error]', error.message);
    return null;
  }
};

const notifyRole = async (role, { senderId = null, title, message, type = 'SYSTEM', requestId = null }) => {
  try {
    const users = await User.find({ role, isActive: true }).select('_id');
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: senderId,
      title,
      message,
      type,
      relatedRequest: requestId
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('[NotificationService Role Error]', error.message);
  }
};

const notifyManagersAndAdmins = async ({ senderId = null, title, message, type = 'SYSTEM', requestId = null }) => {
  try {
    const users = await User.find({
      role: { $in: [ROLES.ADMIN, ROLES.MANAGER] },
      isActive: true
    }).select('_id');
    
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: senderId,
      title,
      message,
      type,
      relatedRequest: requestId
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('[NotificationService Managers Error]', error.message);
  }
};

module.exports = {
  notifyUser,
  notifyRole,
  notifyManagersAndAdmins
};
