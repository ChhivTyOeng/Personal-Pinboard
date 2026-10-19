import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addMember,
  removeMember,
} from '../controllers/categoryController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:memberId', protect, removeMember);

export default router;
