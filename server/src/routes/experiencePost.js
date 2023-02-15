import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    getAllExperiencePost,
    getExperiencePostById,
    createExperiencePost,
    updateExperiencePostById
} from '../controllers/experiencePost';

const router = express.Router();

router.get('/', verifyToken, getAllExperiencePost);
router.get('/:id', verifyToken, getExperiencePostById);

router.post('/', verifyToken, createExperiencePost);

router.patch('/', verifyToken, updateExperiencePostById);

export default router;