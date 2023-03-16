import express from 'express'

import {
    getUserById,
    getUserByName,
    updateInfomation,
    updateImage,
    deleteImage,
    getPasswordByUserId,
    updatePassword,
    getUserByEmail,
    updatePasswordByEmail,
    getAllUser
} from '../controllers/user';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

router.get('/all', verifyToken, getAllUser);
router.get('/:id', verifyToken, getUserById);
router.get('/name/:name', verifyToken, getUserByName);
router.get('/email/:email', getUserByEmail);
router.get('/password/:id', verifyToken, getPasswordByUserId);

router.patch('/password',verifyToken, updatePassword);
router.patch('/email/password', updatePasswordByEmail);

router.patch('/', verifyToken, updateInfomation);
router.patch('/image', verifyToken, updateImage);

router.delete('/image', verifyToken, deleteImage);

export default router