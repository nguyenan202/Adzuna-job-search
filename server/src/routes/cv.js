import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createCV,
    deleteResume,
    getAllCVByUserId,
    getCvById,
    updateCV,
    updatePictureCV
} from '../controllers/cv';

const router = express.Router();

router.get('/user/:userId', verifyToken, getAllCVByUserId);
router.get('/:id', verifyToken, getCvById);

router.post('/', verifyToken, createCV);

router.patch('/', verifyToken, updateCV);
router.patch('/picture', verifyToken, updatePictureCV);

router.delete('/', verifyToken, deleteResume);

export default router;