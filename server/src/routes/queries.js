import express from 'express';
import { runQuery, runCustomQuery } from '../controllers/queryController.js';

const router = express.Router();

router.post('/run', runQuery);
router.post('/custom', runCustomQuery);

export default router;
