const express = require('express');
const {
  markAttendance,
  updateAttendance,
  getAttendance,
  getAttendanceSummary
} = require('../controller/attendanceController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// router.use(auth);

router.post('/', markAttendance);
router.put('/:id', updateAttendance);
router.get('/', getAttendance);
router.get('/summary', getAttendanceSummary);

module.exports = router;