import express from 'express';

import {
    verifyToken
} from '../middlewares/auth';
import {
    addMessage,
    getAllMessage
} from '../controllers/message';

const router = express.Router();

router.get('/room-chat/:id', verifyToken, getAllMessage);

router.post('/', verifyToken, addMessage);

export default router;