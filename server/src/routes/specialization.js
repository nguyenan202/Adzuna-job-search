import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createSpecializationByJobId,
    getAllSpecializationByJobId,
} from '../controllers/spectiallization';

const router = express.Router();

router.get('/:jobId', verifyToken, getAllSpecializationByJobId);

router.post('/', verifyToken, createSpecializationByJobId);

export default router;