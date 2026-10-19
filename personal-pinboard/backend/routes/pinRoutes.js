import express from 'express';
import {
  getAllPins,
  getPinById,
  createPin,
  updatePin,
  deletePin,
  toggleLike,
  ratePin,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  reportPin,
  handleImageUpload,
} from '../controllers/pinController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { uploadPinImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalProtect, getAllPins)
  .post(protect, createPin);

router.post('/upload', uploadPinImage.single('image'), handleImageUpload);

router.route('/:id')
  .get(optionalProtect, getPinById)
  .put(protect, updatePin)
  .delete(protect, deletePin);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/rate', protect, ratePin);

router.route('/:id/comments')
  .get(getComments)
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.post('/:id/report', protect, reportPin);

export default router;
