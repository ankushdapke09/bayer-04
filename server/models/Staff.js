const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: [true, 'Staff ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9]{3,10}$/, 'Staff ID must be 3-10 alphanumeric characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Support'],
      message: 'Role must be Doctor, Nurse, Technician, Administrative, or Support'
    }
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [50, 'Department cannot exceed 50 characters']
  },
  specialization: {
    type: String,
    trim: true,
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  },
  shiftPreference: [{
    type: String,
    enum: ['Morning', 'Afternoon', 'Night']
  }],
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    validate: {
      validator: function(v) {
        return /^[\d\s-+()]{10,15}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
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

staffSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

staffSchema.index({ staffId: 1 });
staffSchema.index({ role: 1, department: 1 });
staffSchema.index({ isActive: 1 });
staffSchema.index({ name: 'text', staffId: 'text' });

module.exports = mongoose.model('Staff', staffSchema);