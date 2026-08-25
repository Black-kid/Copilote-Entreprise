const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { ROLES } = require('../config/constants');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (or Admin can set custom roles)
const register = async (req, res, next) => {
  try {
    const { name, email, password, department, role, phone, jobTitle } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cette adresse email existe déjà.'
      });
    }

    // Role safety: Public registration defaults to EMPLOYEE unless request is authenticated as ADMIN
    let assignedRole = ROLES.EMPLOYEE;
    if (role && Object.values(ROLES).includes(role)) {
      if (req.user && req.user.role === ROLES.ADMIN) {
        assignedRole = role;
      } else if (role === ROLES.EMPLOYEE || role === ROLES.TECHNICIAN) {
        assignedRole = role;
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      department: department || 'Support & Maintenance',
      role: assignedRole,
      phone: phone || '',
      jobTitle: jobTitle || ''
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner votre email et mot de passe.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé par un administrateur.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides.'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject()
    }
  });
};

// @route   PUT /api/auth/profile
// @desc    Update personal user profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, jobTitle, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      data: {
        user: user.toSafeObject()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
