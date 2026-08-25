const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get notifications for logged in user
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const query = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name role avatar')
      .populate('relatedRequest', 'ticketNumber title status priority')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable.'
      });
    }

    res.status(200).json({
      success: true,
      data: { notification }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications for user as read
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues.'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification introuvable.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification supprimée.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
