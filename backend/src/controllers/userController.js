const User = require('../models/User');
const Request = require('../models/Request');
const { ROLES, STATUSES } = require('../config/constants');

// @route   GET /api/users
// @desc    Get all users with filtering
// @access  Private (Admin, Manager)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, department, isActive, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { jobTitle: regex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        users: users.map(u => u.toSafeObject())
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/technicians
// @desc    Get all technicians for assignment dropdowns with active workload
// @access  Private
const getTechnicians = async (req, res, next) => {
  try {
    const techs = await User.find({ role: ROLES.TECHNICIAN, isActive: true })
      .select('name email department jobTitle avatar phone');

    const techsWithLoad = await Promise.all(
      techs.map(async (tech) => {
        const activeCount = await Request.countDocuments({
          assignedTo: tech._id,
          status: { $in: [STATUSES.ASSIGNEE, STATUSES.EN_COURS] }
        });
        return {
          ...tech.toObject(),
          activeTasks: activeCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { technicians: techsWithLoad }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    res.status(200).json({
      success: true,
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/users
// @desc    Create new user by Admin
// @access  Private (Admin only)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, phone, jobTitle } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur existe déjà avec cet email.'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: password || 'OpsFlow2026!',
      role: role || ROLES.EMPLOYEE,
      department: department || 'Support & Maintenance',
      phone: phone || '',
      jobTitle: jobTitle || ''
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/users/:id
// @desc    Update user info & role by Admin
// @access  Private (Admin only)
const updateUser = async (req, res, next) => {
  try {
    const { name, role, department, phone, jobTitle, isActive, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    if (name) user.name = name;
    if (role && Object.values(ROLES).includes(role)) user.role = role;
    if (department) user.department = department;
    if (phone !== undefined) user.phone = phone;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (isActive !== undefined) user.isActive = isActive;
    if (password && password.length >= 6) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès.',
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas désactiver votre propre compte.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Compte ${user.isActive ? 'activé' : 'désactivé'} avec succès.`,
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getTechnicians,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus
};
