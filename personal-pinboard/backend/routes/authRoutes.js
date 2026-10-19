import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  loginWithOtp,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', loginWithGoogle);
router.post('/otp-login', loginWithOtp);

export default router;
