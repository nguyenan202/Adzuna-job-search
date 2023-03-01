import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    getAllRoomChatByUserId,
    getRoomChat,
    getRoomChatById,
} from '../controllers/roomChat';

const router = express.Router();

router.get('/user/:userId', verifyToken, getAllRoomChatByUserId);
router.get('/:id/:userId', verifyToken, getRoomChatById);

router.post('/', verifyToken, getRoomChat);

export default router;