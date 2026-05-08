import express from 'express';
import { simulatePayment, runCustomTrigger } from '../controllers/triggerController.js';

const router = express.Router();

router.post('/payment', simulatePayment);
router.post('/custom', runCustomTrigger);

export default router;
