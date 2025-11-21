// export const addStaff = async (req, res, next) => {};
// export const login = async (req, res, next) => {};


const Staff = require('../models/Staff');
const { body, query } = require('express-validator');
const logger = require('../utils/logger');
const { handleValidationErrors, validateObjectId } = require('../middleware/validation');

exports.getAllStaff = 
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        role, 
        department,
        isActive = true,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const query = { isActive };
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { staffId: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ];
      }

      if (role) query.role = role;
      if (department) query.department = { $regex: department, $options: 'i' };

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const staff = await Staff.find(query)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await Staff.countDocuments(query);

      res.json({
        success: true,
        data: {
          staff,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      logger.error('Get all staff error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching staff'
      });
    }
  }

exports.getStaff = 
  async (req, res) => {
    try {
      const staff = await Staff.findById(req.params.id);
      
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff member not found'
        });
      }

      res.json({
        success: true,
        data: { staff }
      });

    } catch (error) {
      logger.error('Get staff error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching staff member'
      });
    }
  }

exports.createStaff = [
  // ...exports.validateStaff,
  async (req, res) => {
    try {
      const staffData = req.body;
      staffData.staffId = staffData.staffId.toUpperCase();
      
      const existingStaff = await Staff.findOne({ 
        $or: [
          { staffId: staffData.staffId },
          ...(staffData.email ? [{ email: staffData.email }] : [])
        ]
      });
      
      if (existingStaff) {
        const field = existingStaff.staffId === staffData.staffId ? 'Staff ID' : 'Email';
        return res.status(400).json({
          success: false,
          message: `${field} already exists`
        });
      }

      const staff = new Staff(staffData);
      await staff.save();

      // logger.info(`Staff member created: ${staff.staffId} by admin ${req.admin.name}`);

      res.status(201).json({
        success: true,
        message: 'Staff member created successfully',
        data: { staff }
      });

    } catch (error) {
      logger.error('Create staff error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
];

exports.updateStaff = 
  async (req, res) => {
    console.log('-up-req.body--', req.body);
    
    try {
      const { id } = req.params;
      const updates = req.body;
      
      if (updates.staffId) {
        updates.staffId = updates.staffId.toUpperCase();
      }

      const existingStaff = await Staff.findOne({
        _id: { $ne: id },
        $or: [
          { staffId: updates.staffId },
          ...(updates.email ? [{ email: updates.email }] : [])
        ]
      });
      
      if (existingStaff) {
        const field = existingStaff.staffId === updates.staffId ? 'Staff ID' : 'Email';
        return res.status(400).json({
          success: false,
          message: `${field} already exists`
        });
      }

      const staff = await Staff.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      ).select('-__v');

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff member not found'
        });
      }

      // logger.info(`Staff member updated: ${staff.staffId} by admin ${req.admin.name}`);

      res.json({
        success: true,
        message: 'Staff member updated successfully',
        data: { staff }
      });

    } catch (error) {
      logger.error('Update staff error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

exports.deleteStaff = 
  async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await Staff.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
      );

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff member not found'
        });
      }

      // logger.info(`Staff member deactivated: ${staff.staffId} by admin ${req.admin.name}`);

      res.json({
        success: true,
        message: 'Staff member deactivated successfully'
      });

    } catch (error) {
      logger.error('Delete staff error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deactivating staff member'
      });
    }
  }

exports.getStaffStats = async (req, res) => {
  try {
    const stats = await Staff.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Staff.countDocuments({ isActive: true });
    
    const roleStats = {};
    stats.forEach(stat => {
      roleStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        total,
        byRole: roleStats
      }
    });

  } catch (error) {
    logger.error('Get staff stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff statistics'
    });
  }
};