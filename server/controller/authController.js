const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');
const config = require('../config');
const { handleValidationErrors } = require('../middleware/validation');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

exports.validateLogin = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

exports.login = async (req, res) => {
  console.log('--req.bod',req.body);
  
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ name: name.toLowerCase() });
    if (!admin || !admin.isActive) {
      logger.warn(`Failed login attempt for name: ${name}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for name: ${name}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    logger.info(`Admin ${name} logged in successfully`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

exports.changePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const admin = await Admin.findById(req.admin._id);
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      admin.password = newPassword;
      await admin.save();

      logger.info(`Admin ${admin.name} changed password successfully`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Error changing password'
      });
    }
  }
];