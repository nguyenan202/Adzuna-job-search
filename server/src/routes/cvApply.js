import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createCvUpload,
    getAllCvUploadByPostIdAndUserId,
    getAllByPostId,
    updateStatus,
    getAllByUserId,
    deleteCVApllyByPostId
} from '../controllers/cvApply';

const router = express.Router();

router.get('/post/:postId', verifyToken, getAllByPostId);
router.get('/user/:userId/post/:postId', verifyToken, getAllCvUploadByPostIdAndUserId);
router.get('/user/:userId', verifyToken, getAllByUserId);

router.post('/', verifyToken, createCvUpload);

router.patch('/status', verifyToken, updateStatus);
router.delete('/post', verifyToken, deleteCVApllyByPostId);

export default router;