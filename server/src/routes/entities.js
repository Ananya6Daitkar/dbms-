import express from 'express';
import { getEntity } from '../controllers/entityController.js';

const router = express.Router();

router.get('/:name', getEntity);

export default router;
