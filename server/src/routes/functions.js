import express from 'express';
import { runFunction } from '../controllers/functionController.js';

const router = express.Router();

router.post('/run', runFunction);

export default router;
