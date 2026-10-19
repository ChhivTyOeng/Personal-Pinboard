import express from 'express';
import {
  getUserProfile,
  updateProfile,
  changePassword,
  followUser,
  uploadAvatar,
} from '../controllers/userController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { uploadAvatarImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, uploadAvatarImage.single('avatar'), uploadAvatar);
router.get('/:userId', optionalProtect, getUserProfile);
router.post('/:userId/follow', protect, followUser);

export default router;
