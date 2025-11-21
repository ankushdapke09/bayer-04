const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Support']
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

const shiftScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  shiftType: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Night']
  },
  assignments: [assignmentSchema],
  availableSlots: {
    Doctor: { type: Number, default: 0, min: 0 },
    Nurse: { type: Number, default: 0, min: 0 },
    Technician: { type: Number, default: 0, min: 0 },
    Administrative: { type: Number, default: 0, min: 0 },
    Support: { type: Number, default: 0, min: 0 }
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

shiftScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

shiftScheduleSchema.index({ date: 1, shiftType: 1 }, { unique: true });
shiftScheduleSchema.index({ 'assignments.staffId': 1 });
shiftScheduleSchema.index({ date: 1 });

shiftScheduleSchema.virtual('filledSlots').get(function() {
  const filled = {};
  const roles = ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Support'];
  
  roles.forEach(role => {
    filled[role] = this.assignments.filter(a => a.role === role).length;
  });
  
  return filled;
});

shiftScheduleSchema.virtual('remainingSlots').get(function() {
  const remaining = {};
  const roles = ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Support'];
  
  roles.forEach(role => {
    const filled = this.assignments.filter(a => a.role === role).length;
    remaining[role] = Math.max(0, this.availableSlots[role] - filled);
  });
  
  return remaining;
});

shiftScheduleSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ShiftSchedule', shiftScheduleSchema);