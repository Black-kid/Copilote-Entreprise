const mongoose = require('mongoose');
const { STATUSES, PRIORITIES, CATEGORIES, DEPARTMENTS } = require('../config/constants');

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '1.2 MB' },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const requestSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Le titre de la demande est obligatoire'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description détaillée est obligatoire'],
    trim: true
  },
  category: {
    type: String,
    enum: Object.values(CATEGORIES),
    default: CATEGORIES.IT_INFRASTRUCTURE
  },
  priority: {
    type: String,
    enum: Object.values(PRIORITIES),
    default: PRIORITIES.MOYENNE,
    index: true
  },
  status: {
    type: String,
    enum: Object.values(STATUSES),
    default: STATUSES.CREEE,
    index: true
  },
  department: {
    type: String,
    enum: DEPARTMENTS,
    required: [true, 'Le département concerné est obligatoire']
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le demandeur est obligatoire'],
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  estimatedHours: {
    type: Number,
    default: 2,
    min: 0
  },
  actualHours: {
    type: Number,
    default: 0,
    min: 0
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date
  },
  slaHours: {
    type: Number,
    default: 24
  },
  slaBreached: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [attachmentSchema],
  archivedAt: {
    type: Date,
    default: null
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Auto-generate ticketNumber if not provided
requestSchema.pre('save', async function () {
  if (!this.ticketNumber) {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.ticketNumber = `OPS-${year}-${randomSuffix}`;
  }
  
  // Set default due date based on priority SLA if not set
  if (!this.dueDate) {
    const hoursMap = {
      [PRIORITIES.URGENTE]: 4,
      [PRIORITIES.HAUTE]: 12,
      [PRIORITIES.MOYENNE]: 24,
      [PRIORITIES.BASSE]: 72
    };
    const hours = hoursMap[this.priority] || 24;
    this.slaHours = hours;
    this.dueDate = new Date(Date.now() + hours * 3600 * 1000);
  }
});

module.exports = mongoose.model('Request', requestSchema);
