import express from 'express';
import { verifyToken } from '../middlewares/auth';
import {
    createPostAddress,
} from '../controllers/postAddress';

const router = express.Router();

router.post('/', verifyToken, createPostAddress);


export default router;