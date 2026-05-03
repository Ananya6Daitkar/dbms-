import express from 'express';
import { runQuery } from '../controllers/queryController.js';

const router = express.Router();

router.post('/run', runQuery);

export default router;
