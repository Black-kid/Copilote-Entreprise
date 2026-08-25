const mongoose = require('mongoose');
const { ACTION_TYPES } = require('../config/constants');

const activityLogSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: Object.values(ACTION_TYPES),
    required: true,
    index: true
  },
  fromStatus: {
    type: String,
    default: null
  },
  toStatus: {
    type: String,
    default: null
  },
  details: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
