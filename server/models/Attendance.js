const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shiftType: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Night']
  },
  status: {
    type: String,
    required: true,
    enum: ['present', 'absent', 'late', 'sick-leave', 'vacation', 'day-off', 'emergency-leave']
  },
  checkIn: Date,
  checkOut: Date,
  hoursWorked: {
    type: Number,
    min: 0,
    max: 24
  },
  comments: {
    type: String,
    maxlength: 500
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

attendanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate hours worked if checkIn and checkOut are provided
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.hoursWorked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  }
  
  next();
});

attendanceSchema.index({ staffId: 1, date: 1, shiftType: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);