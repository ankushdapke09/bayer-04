const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { handleValidationErrors, validateObjectId } = require('../middleware/validation');

exports.markAttendance =
    async (req, res) => {
        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const attendanceData = {
                    ...req.body,
                    markedBy: req.admin._id,
                    date: new Date(req.body.date)
                };

                // Check if attendance already marked
                const existingAttendance = await Attendance.findOne({
                    staffId: attendanceData.staffId,
                    date: attendanceData.date,
                    shiftType: attendanceData.shiftType
                }).session(session);

                if (existingAttendance) {
                    throw new Error('Attendance already marked for this staff member on the specified date and shift');
                }

                // Verify staff exists and is active
                const staff = await Staff.findById(attendanceData.staffId).session(session);
                if (!staff || !staff.isActive) {
                    throw new Error('Staff member not found or inactive');
                }

                const attendance = new Attendance(attendanceData);
                await attendance.save({ session });

                logger.info(`Attendance marked for staff ${staff.staffId} on ${attendanceData.date} by admin ${req.admin.name}`);

                res.status(201).json({
                    success: true,
                    message: 'Attendance marked successfully',
                    data: { attendance }
                });
            });

        } catch (error) {
            logger.error('Mark attendance error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        } finally {
            await session.endSession();
        }
    }


exports.updateAttendance =
    async (req, res) => {
        try {
            const { id } = req.params;
            const updates = {
                ...req.body,
                updatedBy: req.admin._id
            };

            const attendance = await Attendance.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            ).populate('staffId', 'name staffId role')
                .populate('markedBy', 'name')
                .populate('updatedBy', 'name');

            if (!attendance) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found'
                });
            }

            logger.info(`Attendance updated for record ${id} by admin ${req.admin.name}`);

            res.json({
                success: true,
                message: 'Attendance updated successfully',
                data: { attendance }
            });

        } catch (error) {
            logger.error('Update attendance error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

exports.getAttendance =
    async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                staffId,
                role,
                status,
                shiftType,
                page = 1,
                limit = 20
            } = req.query;

            const query = {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };

            if (staffId) query.staffId = staffId;
            if (role) query['staffId.role'] = role;
            if (status) query.status = status;
            if (shiftType) query.shiftType = shiftType;

            const attendance = await Attendance.find(query)
                .populate('staffId', 'name staffId role department')
                .populate('markedBy', 'name')
                .populate('updatedBy', 'name')
                .sort({ date: -1, shiftType: 1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await Attendance.countDocuments(query);

            res.json({
                success: true,
                data: {
                    attendance,
                    pagination: {
                        current: parseInt(page),
                        pages: Math.ceil(total / limit),
                        total,
                        limit: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            logger.error('Get attendance error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance records'
            });
        }
    }

exports.getAttendanceSummary =
    async (req, res) => {
        try {
            const { startDate, endDate, department } = req.query;

            const matchStage = {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };

            const lookupStage = {
                $lookup: {
                    from: 'staff',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staffInfo'
                }
            };

            const unwindStage = { $unwind: '$staffInfo' };

            if (department) {
                matchStage['staffInfo.department'] = new RegExp(department, 'i');
            }

            const summary = await Attendance.aggregate([
                { $match: matchStage },
                lookupStage,
                unwindStage,
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                            status: '$status',
                            role: '$staffInfo.role'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.date',
                        statusCounts: {
                            $push: {
                                status: '$_id.status',
                                role: '$_id.role',
                                count: '$count'
                            }
                        },
                        total: { $sum: '$count' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            res.json({
                success: true,
                data: { summary }
            });

        } catch (error) {
            logger.error('Get attendance summary error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance summary'
            });
        }
    }