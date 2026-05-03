import express from 'express';
import { simulatePayment } from '../controllers/triggerController.js';

const router = express.Router();

router.post('/payment', simulatePayment);

export default router;
