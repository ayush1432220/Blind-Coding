import express from 'express';
import { logSecurityEvent } from '../controllers/securityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log-event', protect, logSecurityEvent);

export default router;