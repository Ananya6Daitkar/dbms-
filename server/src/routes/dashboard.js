import express from 'express';
import { getKpis, getCharts } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/kpis', getKpis);
router.get('/charts', getCharts);

export default router;
