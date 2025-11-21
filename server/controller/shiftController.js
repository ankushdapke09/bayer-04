const ShiftSchedule = require('../models/ShiftSchedule');
const ShiftTemplate = require('../models/ShiftTemplate');
const Staff = require('../models/Staff');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { handleValidationErrors, validateObjectId } = require('../middleware/validation');

exports.getShiftTemplates = async (req, res) => {
  try {
    const templates = await ShiftTemplate.find({ isActive: true });
    
    res.json({
      success: true,
      data: { templates }
    });

  } catch (error) {
    logger.error('Get shift templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shift templates'
    });
  }
};

exports.updateShiftTemplate = 
  async (req, res) => {
    try {
      const template = await ShiftTemplate.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Shift template not found'
        });
      }

      logger.info(`Shift template updated: ${template.shiftType} by admin ${req.admin.name}`);

      res.json({
        success: true,
        message: 'Shift template updated successfully',
        data: { template }
      });

    } catch (error) {
      logger.error('Update shift template error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

exports.getShifts = 
  async (req, res) => {
    try {
      const { startDate, endDate, shiftType } = req.query;

      const query = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      
      if (shiftType) query.shiftType = shiftType;

      const shifts = await ShiftSchedule.find(query)
        .populate('assignments.staffId', 'name staffId contactNumber role department')
        .populate('assignments.assignedBy', 'name')
        .sort({ date: 1, shiftType: 1 });

      res.json({
        success: true,
        data: { shifts }
      });

    } catch (error) {
      logger.error('Get shifts error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching shifts'
      });
    }
  }

exports.assignStaffToShift =
  async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { date, shiftType, staffId } = req.body;

        // Check for shift conflicts
        const existingAssignment = await ShiftSchedule.findOne({
          date: new Date(date),
          'assignments.staffId': staffId
        }).session(session);

        if (existingAssignment) {
          throw new Error('Staff member already assigned to a shift on this date');
        }

        // Get staff details
        const staff = await Staff.findById(staffId).session(session);
        if (!staff || !staff.isActive) {
          throw new Error('Staff member not found or inactive');
        }

        // Find or create shift schedule
        let shiftSchedule = await ShiftSchedule.findOne({
          date: new Date(date),
          shiftType
        }).session(session);

        if (!shiftSchedule) {
          const template = await ShiftTemplate.findOne({ shiftType }).session(session);
          if (!template) {
            throw new Error('Shift template not found');
          }

          shiftSchedule = new ShiftSchedule({
            date: new Date(date),
            shiftType,
            availableSlots: template.capacity
          });
        }

        // Check available slots
        const currentRoleCount = shiftSchedule.assignments.filter(
          assignment => assignment.role === staff.role
        ).length;

        if (currentRoleCount >= shiftSchedule.availableSlots[staff.role]) {
          throw new Error(`No available slots for ${staff.role} role in this shift`);
        }

        // Add assignment
        shiftSchedule.assignments.push({
          staffId: staff._id,
          role: staff.role,
          assignedBy: req.admin._id
        });

        await shiftSchedule.save({ session });

        logger.info(`Staff ${staff.staffId} assigned to ${shiftType} shift on ${date} by admin ${req.admin.name}`);

        res.json({
          success: true,
          message: 'Staff assigned to shift successfully',
          data: { shiftSchedule }
        });
      });

    } catch (error) {
      logger.error('Assign staff to shift error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    } finally {
      await session.endSession();
    }
  }

exports.removeStaffFromShift = 
  async (req, res) => {
    try {
      const { shiftId } = req.params;
      const { assignmentId } = req.body;

      const shiftSchedule = await ShiftSchedule.findById(shiftId);
      if (!shiftSchedule) {
        return res.status(404).json({
          success: false,
          message: 'Shift schedule not found'
        });
      }

      const assignmentIndex = shiftSchedule.assignments.findIndex(
        assignment => assignment._id.toString() === assignmentId
      );

      if (assignmentIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }

      shiftSchedule.assignments.splice(assignmentIndex, 1);
      await shiftSchedule.save();

      logger.info(`Staff removed from shift ${shiftId} by admin ${req.admin.name}`);

      res.json({
        success: true,
        message: 'Staff removed from shift successfully',
        data: { shiftSchedule }
      });

    } catch (error) {
      logger.error('Remove staff from shift error:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing staff from shift'
      });
    }
  }

exports.getStaffAvailability = 
  async (req, res) => {
    try {
      const { date, shiftType } = req.query;

      // Get all active staff
      const allStaff = await Staff.find({ isActive: true })
        .select('name staffId role department shiftPreference');

      // Get staff already assigned to this shift
      const existingShift = await ShiftSchedule.findOne({
        date: new Date(date),
        shiftType
      }).populate('assignments.staffId', 'staffId');

      const assignedStaffIds = existingShift?.assignments.map(a => a.staffId._id.toString()) || [];

      // Filter available staff
      const availableStaff = allStaff.filter(staff => 
        !assignedStaffIds.includes(staff._id.toString())
      );

      res.json({
        success: true,
        data: {
          availableStaff,
          assignedCount: assignedStaffIds.length,
          availableCount: availableStaff.length
        }
      });

    } catch (error) {
      logger.error('Get staff availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching staff availability'
      });
    }
  }