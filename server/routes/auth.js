const express = require('express');
const { 
  login, 
  getProfile, 
  changePassword, 
  validateLogin 
} = require('../controller/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', validateLogin, login);
router.get('/profile', auth, getProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;