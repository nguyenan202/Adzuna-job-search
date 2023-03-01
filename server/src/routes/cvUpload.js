import express from 'express'

import { verifyToken } from '../middlewares/auth';
import {
    createCvUpload,
    deleteCVUpload,
    getAllCvUploadByUserId,
    updateCvUpload
} from '../controllers/cvUpload';

const router = express.Router();

router.get('/user/:userId', verifyToken, getAllCvUploadByUserId);

router.post('/', verifyToken, createCvUpload);

router.patch('/', verifyToken, updateCvUpload);

router.delete('/', verifyToken, deleteCVUpload);

export default router;