import express from 'express';
import { runFunction, runCustomFunction } from '../controllers/functionController.js';

const router = express.Router();

router.post('/run', runFunction);
router.post('/custom', runCustomFunction);

export default router;
