const express = require('express');
const {
  getAllUsers,
  getTechnicians,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

// Publicly available to all authenticated users for technician assignment list
router.get('/technicians', getTechnicians);

// Admin & Manager accessible
router.get('/', authorize(ROLES.ADMIN, ROLES.MANAGER), getAllUsers);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), getUserById);

// Admin only actions
router.post('/', authorize(ROLES.ADMIN), createUser);
router.put('/:id', authorize(ROLES.ADMIN), updateUser);
router.patch('/:id/toggle-status', authorize(ROLES.ADMIN), toggleUserStatus);

module.exports = router;
