import express from 'express'

import {
    getUserById,
    getUserByName,
    updateInfomation,
    updateImage,
    deleteImage,
    getPasswordByUserId,
    updatePassword
} from '../controllers/user';
import { verifyToken, verifyTokenAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/:id', verifyTokenAdmin, getUserById);
router.get('/name/:name', verifyTokenAdmin, getUserByName);
router.get('/password/:id', verifyToken, getPasswordByUserId);

router.patch('/password',verifyToken, updatePassword);

router.patch('/', verifyToken, updateInfomation);
router.patch('/image', verifyToken, updateImage);

router.delete('/image', verifyToken, deleteImage);

export default router