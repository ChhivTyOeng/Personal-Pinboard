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
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:memberId', protect, removeMember);

export default router;
