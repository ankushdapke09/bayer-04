import express from 'express';
import { login, addStaff } from '../controller/staffsController.js';
// import { registerValidation } from '../validations/registerValidation.js';

const router = express.Router()


router.post('/addStaff',  addStaff)
router.post('/login', login)

export default router