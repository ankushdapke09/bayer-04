// import express from 'express';
// import { login, addStaff } from '../controller/staffsController.js';
// // import { registerValidation } from '../validations/registerValidation.js';

// const router = express.Router()


// router.post('/addStaff',  addStaff)
// router.post('/login', login)

const express = require('express');
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStats
} = require('../controller/staffController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// router.use(auth);


router.get('/', getAllStaff);
router.get('/stats', getStaffStats);
router.get('/:id', getStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

module.exports = router;