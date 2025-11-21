const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const ShiftTemplate = require('../models/ShiftTemplate');
const config = require('../config');
const logger = require('./logger');

const initialAdmin = {
  name: 'admin',
  password: 'admin123',
  role: 'super-admin'
};

const shiftTemplates = [
  {
    shiftType: 'Morning',
    name: 'Morning Shift',
    startTime: '08:00',
    endTime: '16:00',
    capacity: {
      Doctor: 5,
      Nurse: 10,
      Technician: 3,
      Administrative: 2,
      Support: 4
    },
    description: 'Morning shift for hospital staff'
  },
  {
    shiftType: 'Afternoon',
    name: 'Afternoon Shift',
    startTime: '16:00',
    endTime: '00:00',
    capacity: {
      Doctor: 4,
      Nurse: 8,
      Technician: 2,
      Administrative: 1,
      Support: 3
    },
    description: 'Afternoon shift for hospital staff'
  },
  {
    shiftType: 'Night',
    name: 'Night Shift',
    startTime: '00:00',
    endTime: '08:00',
    capacity: {
      Doctor: 3,
      Nurse: 6,
      Technician: 2,
      Administrative: 1,
      Support: 2
    },
    description: 'Night shift for hospital staff'
  }
];

const setupDatabase = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info('Connected to MongoDB for setup');

    // Create initial admin
    const existingAdmin = await Admin.findOne({ name: initialAdmin.name });
    if (!existingAdmin) {
      const admin = new Admin(initialAdmin);
      await admin.save();
      logger.info('Default admin created successfully');
      console.log('Default Admin Credentials:');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      logger.info('Admin user already exists');
    }

    // Create shift templates
    for (const templateData of shiftTemplates) {
      const existingTemplate = await ShiftTemplate.findOne({ shiftType: templateData.shiftType });
      if (!existingTemplate) {
        const template = new ShiftTemplate(templateData);
        await template.save();
        logger.info(`Shift template created: ${templateData.shiftType}`);
      } else {
        logger.info(`Shift template already exists: ${templateData.shiftType}`);
      }
    }

    logger.info('Database setup completed successfully');
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    logger.error('Database setup error:', error);
    process.exit(1);
  }
};

setupDatabase();