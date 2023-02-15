import express from 'express';

import { verifyToken } from '../middlewares/auth';
import {
    createJob,
    getAllJob
} from '../controllers/job';

const router = express.Router();

router.get('/', verifyToken, getAllJob);

router.post('/', verifyToken, createJob);

export default router;