const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/requestController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { validate } = require('../middlewares/validator');
const { ROLES } = require('../config/constants');

const router = express.Router();

// All request routes require authentication
router.use(authenticate);

// Request creation validation
const createRequestValidation = [
  body('title').trim().notEmpty().withMessage('Le titre est obligatoire'),
  body('description').trim().notEmpty().withMessage('La description est obligatoire'),
  body('department').trim().notEmpty().withMessage('Le département est obligatoire'),
  validate
];

const commentValidation = [
  body('content').trim().notEmpty().withMessage('Le texte du commentaire est requis'),
  validate
];

// Routes
router.get('/', getAllRequests);
router.post('/', createRequestValidation, createRequest);
router.get('/:id', getRequestById);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

// Workflow state & Assignment
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', authorize(ROLES.ADMIN, ROLES.MANAGER), assignRequest);

// Comments & Audit history
router.get('/:id/comments', getComments);
router.post('/:id/comments', commentValidation, addComment);
router.get('/:id/history', getActivityHistory);

module.exports = router;
