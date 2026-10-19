import express from 'express';
import authRoutes from './authRoutes.js';
import pinRoutes from './pinRoutes.js';
import boardRoutes from './boardRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/pins', pinRoutes);
router.use('/boards', boardRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Personal Pinboard API',
  });
});

export default router;
