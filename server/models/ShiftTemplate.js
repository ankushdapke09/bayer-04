const mongoose = require('mongoose');

const shiftTemplateSchema = new mongoose.Schema({
  shiftType: {
    type: String,
    required: true,
    unique: true,
    enum: ['Morning', 'Afternoon', 'Night']
  },
  name: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  capacity: {
    Doctor: { type: Number, default: 0, min: 0 },
    Nurse: { type: Number, default: 0, min: 0 },
    Technician: { type: Number, default: 0, min: 0 },
    Administrative: { type: Number, default: 0, min: 0 },
    Support: { type: Number, default: 0, min: 0 }
  },
  description: String,
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

shiftTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ShiftTemplate', shiftTemplateSchema);