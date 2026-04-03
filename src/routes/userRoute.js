import express from 'express'
import { register , login , logout } from '../controller/authController.js'
import emailVarification from '../utils/varifiation/emailVarification.js';
import { varify } from '../middleware/authMiddleware.js';

const router = express.Router()

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/emailvarify',varify,emailVarification)
export default router

