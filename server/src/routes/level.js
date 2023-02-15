import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createLevel,
    getAllLevel,
    getLevelById,
    updateLevelById
} from '../controllers/level';

const router = express.Router();

router.get('/', verifyToken, getAllLevel);
router.get('/:id', verifyToken, getLevelById);

router.post('/', verifyToken, createLevel);

router.patch('/', verifyToken, updateLevelById);

export default router;