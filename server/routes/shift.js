const express = require('express');
const {
  getShiftTemplates,
  updateShiftTemplate,
  getShifts,
  assignStaffToShift,
  removeStaffFromShift,
  getStaffAvailability
} = require('../controller/shiftController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// router.use(auth);

router.get('/templates', getShiftTemplates);
router.put('/templates/:id', updateShiftTemplate);
router.get('/', getShifts);
router.post('/assign', assignStaffToShift);
router.delete('/:shiftId/remove-staff', removeStaffFromShift);
router.get('/availability', getStaffAvailability);

module.exports = router;