import express from 'express'
import { register , login , logout } from '../controller/authController.js'
import sendOTPtoUser , {checkOtpStatus , varifyOTP} from '../utils/varifiation/emailVarification.js';
import { varify } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router()

router.post('/register', authLimiter ,register);
router.post('/login', authLimiter ,login);
router.post('/logout',logout);

// OTP things
router.get('/otpstatus',varify,checkOtpStatus);
router.get('/sendotp',varify,sendOTPtoUser);
router.post('/varifyOtp',varify,varifyOTP)


export default router

