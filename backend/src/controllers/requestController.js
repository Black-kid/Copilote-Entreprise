const Request = require('../models/Request');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { STATUSES, PRIORITIES, ROLES, ACTION_TYPES } = require('../config/constants');
const { canTransition, getNextAllowedStatuses } = require('../services/workflowService');
const { logActivity } = require('../services/auditService');
const { notifyUser, notifyManagersAndAdmins } = require('../services/notificationService');

// @route   GET /api/requests
// @desc    Get all requests with filtering, search, pagination & sorting
// @access  Private
const getAllRequests = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      department,
      assignedTo,
      requester,
      slaBreached,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Role-based visibility filtering
    // Technicians see requests assigned to them OR all unassigned pending/validated if not filtered
    // Employees see requests they created OR within their department (or all if specified)
    if (req.user.role === ROLES.EMPLOYEE && !req.query.all) {
      // By default, employees see their own requests or can query broad
      if (req.query.myOnly === 'true') {
        query.requester = req.user._id;
      }
    } else if (req.user.role === ROLES.TECHNICIAN && req.query.assignedOnly === 'true') {
      query.assignedTo = req.user._id;
    }

    // Text search in title, description, or ticketNumber
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { ticketNumber: searchRegex },
        { department: searchRegex }
      ];
    }

    if (status) {
      if (status.includes(',')) {
        query.status = { $in: status.split(',').map(s => s.trim()) };
      } else {
        query.status = status;
      }
    }

    if (priority) {
      if (priority.includes(',')) {
        query.priority = { $in: priority.split(',').map(p => p.trim()) };
      } else {
        query.priority = priority;
      }
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (assignedTo) query.assignedTo = assignedTo;
    if (requester) query.requester = requester;
    if (slaBreached === 'true') query.slaBreached = true;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate('requester', 'name email department avatar role')
      .populate('assignedTo', 'name email department avatar role jobTitle')
      .populate('validatedBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Calculate dynamic SLA breached status for non-finished requests
    const now = new Date();
    const formattedRequests = requests.map(reqDoc => {
      const doc = reqDoc.toObject();
      if (![STATUSES.TERMINEE, STATUSES.ARCHIVEE].includes(doc.status)) {
        if (doc.dueDate && new Date(doc.dueDate) < now) {
          doc.slaBreached = true;
        }
      }
      return doc;
    });

    res.status(200).json({
      success: true,
      data: {
        requests: formattedRequests,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/requests/:id
// @desc    Get single request by ID
// @access  Private
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name email department avatar role phone')
      .populate('assignedTo', 'name email department avatar role jobTitle phone')
      .populate('validatedBy', 'name email role')
      .populate('archivedBy', 'name email role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const isRequester = request.requester && request.requester._id.toString() === req.user._id.toString();
    const isAssigned = request.assignedTo && request.assignedTo._id.toString() === req.user._id.toString();
    const allowedNextStatuses = getNextAllowedStatuses(request.status, req.user, isRequester, isAssigned);

    const doc = request.toObject();
    if (![STATUSES.TERMINEE, STATUSES.ARCHIVEE].includes(doc.status)) {
      if (doc.dueDate && new Date(doc.dueDate) < new Date()) {
        doc.slaBreached = true;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        request: doc,
        allowedNextStatuses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/requests
// @desc    Create a new operations request
// @access  Private
const createRequest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      department,
      estimatedHours,
      tags,
      attachments
    } = req.body;

    const request = await Request.create({
      title,
      description,
      category,
      priority: priority || PRIORITIES.MOYENNE,
      department: department || req.user.department,
      requester: req.user._id,
      status: STATUSES.CREEE,
      estimatedHours: estimatedHours || 2,
      tags: tags || [],
      attachments: attachments || []
    });

    // Populate requester
    await request.populate('requester', 'name email department avatar role');

    // Create Audit Log
    await logActivity({
      requestId: request._id,
      userId: req.user._id,
      actionType: ACTION_TYPES.CREATION,
      toStatus: STATUSES.CREEE,
      details: `Demande ${request.ticketNumber} créée par ${req.user.name}`,
      metadata: { priority: request.priority, category: request.category }
    });

    // Notify Managers
    await notifyManagersAndAdmins({
      senderId: req.user._id,
      title: `Nouvelle demande : ${request.ticketNumber}`,
      message: `${req.user.name} a créé une demande [${request.priority}] : "${request.title}"`,
      type: 'STATUS_CHANGE',
      requestId: request._id
    });

    res.status(201).json({
      success: true,
      message: 'Demande créée avec succès.',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/requests/:id
// @desc    Update request basic details
// @access  Private (Requester if status is 'Créée' or Admin/Manager)
const updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const isRequester = request.requester.toString() === req.user._id.toString();
    const isManagerOrAdmin = [ROLES.ADMIN, ROLES.MANAGER].includes(req.user.role);

    if (!isRequester && !isManagerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Vous n’êtes pas autorisé à modifier cette demande.'
      });
    }

    if (request.status === STATUSES.ARCHIVEE) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une demande archivée.'
      });
    }

    const { title, description, category, priority, department, estimatedHours, tags } = req.body;
    const oldPriority = request.priority;

    if (title) request.title = title;
    if (description) request.description = description;
    if (category) request.category = category;
    if (department) request.department = department;
    if (estimatedHours !== undefined) request.estimatedHours = estimatedHours;
    if (tags) request.tags = tags;

    if (priority && priority !== oldPriority) {
      request.priority = priority;
      await logActivity({
        requestId: request._id,
        userId: req.user._id,
        actionType: ACTION_TYPES.PRIORITY_CHANGE,
        details: `Priorité modifiée de '${oldPriority}' à '${priority}' par ${req.user.name}`,
        metadata: { from: oldPriority, to: priority }
      });
    }

    await request.save();
    await request.populate('requester', 'name email department avatar role');
    await request.populate('assignedTo', 'name email department avatar role jobTitle');

    res.status(200).json({
      success: true,
      message: 'Demande mise à jour.',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/requests/:id/status
// @desc    Transition request workflow status
// @access  Private (governed by workflow state machine)
const updateStatus = async (req, res, next) => {
  try {
    const { targetStatus, resolutionNotes, actualHours } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const currentStatus = request.status;
    const isRequester = request.requester.toString() === req.user._id.toString();
    const isAssigned = request.assignedTo && request.assignedTo.toString() === req.user._id.toString();

    // Validate workflow transition
    const check = canTransition(currentStatus, targetStatus, req.user, isRequester, isAssigned);
    if (!check.allowed) {
      return res.status(403).json({
        success: false,
        message: check.reason
      });
    }

    // Special state business logic
    if (targetStatus === STATUSES.ASSIGNEE && !request.assignedTo && !req.body.assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez assigner un technicien pour passer la demande en statut "Assignée".'
      });
    }

    // If assigning during transition
    if (req.body.assignedTo) {
      request.assignedTo = req.body.assignedTo;
      request.validatedBy = req.user._id;
    }

    if (targetStatus === STATUSES.TERMINEE) {
      if (resolutionNotes) request.resolutionNotes = resolutionNotes;
      if (actualHours !== undefined) request.actualHours = actualHours;
    }

    if (targetStatus === STATUSES.ARCHIVEE) {
      request.archivedAt = new Date();
      request.archivedBy = req.user._id;
    }

    request.status = targetStatus;
    await request.save();

    await request.populate('requester', 'name email department avatar role');
    await request.populate('assignedTo', 'name email department avatar role jobTitle');
    await request.populate('validatedBy', 'name email role');

    // Create Audit Log
    await logActivity({
      requestId: request._id,
      userId: req.user._id,
      actionType: targetStatus === STATUSES.ARCHIVEE ? ACTION_TYPES.ARCHIVAL : ACTION_TYPES.STATUS_CHANGE,
      fromStatus: currentStatus,
      toStatus: targetStatus,
      details: `Statut passé de '${currentStatus}' à '${targetStatus}' par ${req.user.name}`,
      metadata: { resolutionNotes, actualHours }
    });

    // Notify requester
    if (request.requester && request.requester._id.toString() !== req.user._id.toString()) {
      await notifyUser({
        recipientId: request.requester._id,
        senderId: req.user._id,
        title: `Demande ${request.ticketNumber} mise à jour`,
        message: `Votre demande est maintenant : "${targetStatus}" (par ${req.user.name}).`,
        type: 'STATUS_CHANGE',
        requestId: request._id
      });
    }

    // Notify assigned technician if status changed to Assignée or Reopened
    if (request.assignedTo && request.assignedTo._id.toString() !== req.user._id.toString()) {
      await notifyUser({
        recipientId: request.assignedTo._id,
        senderId: req.user._id,
        title: `Mise à jour statut : ${request.ticketNumber}`,
        message: `La demande ${request.ticketNumber} est passée à "${targetStatus}".`,
        type: 'STATUS_CHANGE',
        requestId: request._id
      });
    }

    res.status(200).json({
      success: true,
      message: `Statut mis à jour avec succès vers '${targetStatus}'.`,
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/requests/:id/assign
// @desc    Assign or reassign request to a technician
// @access  Private (Manager, Admin)
const assignRequest = async (req, res, next) => {
  try {
    const { technicianId } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const technician = await User.findById(technicianId);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technicien introuvable.'
      });
    }

    const oldAssigneeId = request.assignedTo;
    request.assignedTo = technician._id;
    request.validatedBy = req.user._id;

    // If request was "En attente" or "Créée", transition automatically to "Assignée"
    const prevStatus = request.status;
    if (request.status === STATUSES.EN_ATTENTE || request.status === STATUSES.CREEE) {
      request.status = STATUSES.ASSIGNEE;
    }

    await request.save();
    await request.populate('requester', 'name email department avatar role');
    await request.populate('assignedTo', 'name email department avatar role jobTitle');

    // Audit Log
    await logActivity({
      requestId: request._id,
      userId: req.user._id,
      actionType: ACTION_TYPES.ASSIGNMENT,
      fromStatus: prevStatus,
      toStatus: request.status,
      details: `Demande assignée au technicien ${technician.name} par ${req.user.name}`,
      metadata: { assignedTo: technician.name, technicianId: technician._id }
    });

    // Notify Technician
    await notifyUser({
      recipientId: technician._id,
      senderId: req.user._id,
      title: `Nouvelle intervention assignée : ${request.ticketNumber}`,
      message: `Vous avez été affecté à la demande [${request.priority}] "${request.title}" par ${req.user.name}.`,
      type: 'ASSIGNMENT',
      requestId: request._id
    });

    res.status(200).json({
      success: true,
      message: `Demande assignée avec succès à ${technician.name}.`,
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/requests/:id/comments
// @desc    Add a comment / internal note to request
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content, isInternal } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le message du commentaire est requis.'
      });
    }

    const comment = await Comment.create({
      request: request._id,
      author: req.user._id,
      content: content.trim(),
      isInternal: isInternal === true && [ROLES.ADMIN, ROLES.MANAGER, ROLES.TECHNICIAN].includes(req.user.role)
    });

    await comment.populate('author', 'name email role avatar department');

    // Audit log
    await logActivity({
      requestId: request._id,
      userId: req.user._id,
      actionType: ACTION_TYPES.COMMENT_ADDED,
      details: `Commentaire ajouté par ${req.user.name} ${comment.isInternal ? '(Note interne)' : ''}`,
      metadata: { isInternal: comment.isInternal }
    });

    // Notify counter-party
    if (request.requester.toString() !== req.user._id.toString() && !comment.isInternal) {
      await notifyUser({
        recipientId: request.requester,
        senderId: req.user._id,
        title: `Nouveau message sur ${request.ticketNumber}`,
        message: `${req.user.name} a commenté : "${content.slice(0, 80)}..."`,
        type: 'NEW_COMMENT',
        requestId: request._id
      });
    }

    if (request.assignedTo && request.assignedTo.toString() !== req.user._id.toString()) {
      await notifyUser({
        recipientId: request.assignedTo,
        senderId: req.user._id,
        title: `Nouveau message sur ${request.ticketNumber}`,
        message: `${req.user.name} a commenté : "${content.slice(0, 80)}..."`,
        type: 'NEW_COMMENT',
        requestId: request._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Commentaire enregistré.',
      data: { comment }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/requests/:id/comments
// @desc    Get all comments for a request
// @access  Private
const getComments = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const query = { request: req.params.id };
    // Employees don't see internal notes
    if (req.user.role === ROLES.EMPLOYEE) {
      query.isInternal = false;
    }

    const comments = await Comment.find(query)
      .populate('author', 'name email role avatar department')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/requests/:id/history
// @desc    Get full activity audit log for a request
// @access  Private
const getActivityHistory = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ request: req.params.id })
      .populate('user', 'name email role avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { history: logs }
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/requests/:id
// @desc    Delete request (Admin only or Requester if Créée)
// @access  Private
const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Demande introuvable.'
      });
    }

    const isRequester = request.requester.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isAdmin && !(isRequester && request.status === STATUSES.CREEE)) {
      return res.status(403).json({
        success: false,
        message: 'Action non autorisée. Seul un administrateur peut supprimer cette demande.'
      });
    }

    await Request.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ request: req.params.id });
    await ActivityLog.deleteMany({ request: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Demande et données associées supprimées avec succès.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  updateStatus,
  assignRequest,
  addComment,
  getComments,
  getActivityHistory,
  deleteRequest
};
